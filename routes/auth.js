/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

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
    failureRedirect: `${process.env.CLIENT_ERROR_URL}`,
  }),
  (req, res, next) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        googleId: req.user.googleId,
        firstName: req.user.firstName,
        displayName: req.user.displayName,
        image: req.user.image,
      },
      process.env.JWT_SECRET
    );

    res.redirect(`${process.env.CLIENT_HOME_URL}?token=${token}`);

    try {
      // JWT token Verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        complete: false,
      });

      // Get userId from token
      const userId = decoded.id;
    } catch (err) {
      return next(createError.Unauthorized());
    }
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
