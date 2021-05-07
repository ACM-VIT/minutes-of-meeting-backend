const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc    Auth with google
// @route   GET /auth/google

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    goolge Auth callback
// @route   GET /auth/goolge/callback

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_ERROR_URL,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

// @desc    Logout User
// route    /auth/logout

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
