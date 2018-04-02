require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const SpotifyStrategy = require("passport-spotify").Strategy;
const passport = require("passport");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    spotifyId: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

passport.serializeUser(([user, err], done) => {
  done(err, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user, err) => {
    done(err, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.HOST_URL + "auth/spotify/callback/"
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);
      User.findOrCreate({
        where: { spotifyId: profile.id },
        defaults: {
          name: profile.displayName
        }
      }).then((user, err) => {
        done(err, user);
      });
    }
  )
);

app.use(
  "/static",
  express.static(path.join(__dirname, "client", "build", "static"))
);
app.use(
  session({
    store: new (require("connect-pg-simple")(session))(),
    secret: "keyboard cat",
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", ensureAuthenticated, function(req, res) {
  res.sendFile("client/build/index.html", {
    root: __dirname
  });
});

app.get("/user", ensureAuthenticated, function(req, res) {
  res.json({ user: req.user });
});

app.get("/search", async (req, res) => {
  const albums = await spotifyApi.searchAlbums(req.query.q);
  res.json({ albums: albums.body.albums });
});

app.get("/album/:spotifyId", async (req, res) => {
  const album = await spotifyApi.getAlbum(req.params.spotifyId);
  res.json({ album: album.body });
});

// Auth
app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true
  })
);

app.get(
  "/auth/spotify/callback/",
  passport.authenticate("spotify", {
    failureRedirect: "/auth/spotify"
  }),
  (req, res) => {
    req.session.save(() => {
      res.redirect("/");
    });
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT || 8080);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}
