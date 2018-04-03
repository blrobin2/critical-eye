const path = require("path");
const { Router } = require("express");
const router = Router();

const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/", function(req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../../client", "build")
  });
});

router.get("/privacy-policy", function(req, res) {
  res.sendFile("privacy-policy.html", {
    root: path.join(__dirname, "../pages")
  });
});

router.get("/user", ensureAuthenticated, function(req, res) {
  res.json({ user: req.user });
});

module.exports = router;
