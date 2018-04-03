const { Router } = require("express");
const router = Router();

const passport = require("../passport");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/login", ensureAuthenticated, (req, res) => {
  res.redirect("/");
});

router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true
  })
);

router.get(
  "/spotify/callback/",
  passport.authenticate("spotify", {
    failureRedirect: "/auth/spotify"
  }),
  (req, res) => {
    req.session.save(() => {
      res.redirect("/");
    });
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
