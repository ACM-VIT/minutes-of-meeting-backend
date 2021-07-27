const express = require("express");
const User = require("../models/User");
const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get("/", (req, res) => {
  res.send("Login");
});

// @desc Dashboard
// @route GET /
router.get("/dashboard", async (req, res) => {
  try {
    const moms = await User.find({ user: req.user.id });
    res.render({
      name: req.user.firstName,
      moms,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
