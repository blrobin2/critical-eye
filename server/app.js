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
    this.app.use(
      session({
        store: new (require("connect-pg-simple")(session))(),
        secret: "keyboard cat",
        resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  defineRoutes() {
    this.app.get("/", ensureAuthenticated, function(req, res) {
      res.sendFile("index.html", {
        root: path.join(__dirname, "../client", "build")
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
