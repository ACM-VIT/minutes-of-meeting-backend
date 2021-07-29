const express = require("express");
const Mom = require("../models/Mom");
const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get("/", (req, res) => {
  // res.render("Login");
});

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const moms = await Mom.find({ user: req.user.id }).lean();
    res.render({
      name: req.user.firstName,
      moms,
    });
  } catch (err) {
    console.error(err);
    // error page
    // res.render("error/500");
  }
});

module.exports = router;
