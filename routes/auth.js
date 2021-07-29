/** Express router providing user related routes
 * @requires express
 * @requires passport
 */
const express = require("express");
const passport = require("passport");
const router = express.Router();

/**
 * @description Auth with google
 * @route {GET} /auth/google
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @description google Auth callback
 * @route {GET} /auth/google/callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_ERROR_URL,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_HOME_URL);
  }
);

/**
 * @description Logouts User
 * @route {GET} /auth/logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

/** Exports router to be used by other functions */
module.exports = router;
