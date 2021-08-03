/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
/** Express router providing user related routes
 * @requires express
 * @requires passport
 */
const express = require("express");
const passport = require("passport");
const { create } = require("../models/User");
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
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    // res.redirect(process.env.CLIENT_URL);
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    // console.log(req.user);
    res.redirect(`${process.env.CLIENT_HOME_URL}?token=${token}`);

    try {
      // JWT token Verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        complete: false,
      });

      // Get userId from token
      const userId = decoded.id;
      console.log({ userId });
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
