const express = require("express");
const User = require("../models/User");
const Mom = require("../models/Mom");
const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get("/", (req, res) => {
  res.send("Working");
  // res.render("Login");
});

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const moms = await Mom.find({ user: req.user.id });
    res.render({
      name: req.user.firstName,
      moms,
    });
  } catch (err) {
    console.error(err);
    // error page
    // res.render("error/500")
  }
});

module.exports = router;
