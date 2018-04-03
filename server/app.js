const path = require("path");
const express = require("express");
const session = require("express-session");

const passport = require("./passport");
const { ensureAuthenticated } = require("./middlewares/auth");

const IndexRoutes = require("./routes/index");
const AlbumRoutes = require("./routes/album");
const AuthRoutes = require("./routes/auth");

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
        saveUninitialized: false,
        cookie: { maxAge: 3600 * 1000 } // 1 hour
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  defineRoutes() {
    this.app.use("/", IndexRoutes);
    this.app.use("/album", AlbumRoutes);
    this.app.use("/auth", AuthRoutes);
  }

  listen(port) {
    this.app.listen(process.env.PORT || port);
  }
}

module.exports = App;
