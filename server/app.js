const path = require("path");
const express = require("express");
const session = require("express-session");

const spotifyApi = require("./spotifyApi");
const passport = require("./passport");
const { ensureAuthenticated } = require("./middlewares/auth");

class App {
  constructor() {
    this.app = express();
    this.setupConfig();
    this.defineRoutes();
  }

  setupConfig() {
    this.app.use(
      "/static",
      express.static(path.join(__dirname, "../client", "build", "static"))
    );
    this.app.use(session({
        store: new (require("connect-pg-simple")(session))(),
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600 * 1000 } // 1 hour
      }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  defineRoutes() {
    this.app.get("/", function(req, res) {
      res.sendFile("index.html", {
        root: path.join(__dirname, "../client", "build")
      });
    });

    this.app.get("/privacy-policy", function (req, res) {
      res.sendFile("privacy-policy.html", {
        root: path.join(__dirname, "pages")
      });
    });

    this.app.get("/user", ensureAuthenticated, function(req, res) {
      res.json({ user: req.user });
    });

    // Album
    this.app.get("/album/search", async (req, res) => {
      try {
        const albums = await spotifyApi.searchAlbums(req.query.q);
        res.json({ albums: albums.body.albums });
      } catch ({ message }) {
        res.json({ message });
      }
    });

    this.app.get("/album/:spotifyId", async (req, res) => {
      try {
        const album = await spotifyApi.getAlbum(req.params.spotifyId);
        res.json({ album: album.body });
      } catch ({ message }) {
        res.json({ message });
      }
    });

    // TODO: Setup login page, add api call to React.
    // Setup logout call through React.

    this.app.get("/auth/login", ensureAuthenticated, (req, res) => {
      res.redirect("/");
    });

    // Auth
    this.app.get(
      "/auth/spotify",
      passport.authenticate("spotify", {
        scope: ["user-read-email", "user-read-private"],
        showDialog: true
      })
    );

    this.app.get(
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

    this.app.get("/auth/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });
  }

  listen(port) {
    this.app.listen(process.env.PORT || port);
  }
}

module.exports = App;
