const express = require("express");
const Mom = require("../models/Mom");
const { verifyToken } = require("../middleware/jwt_helper");
const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get("/", (req, res) => {
  // res.render("Login");
});

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const moms = await Mom.find({ user: req.user.id }).lean();
    res.render({
      name: req.user.firstName,
      moms,
    });
  } catch (err) {
    console.error(err);
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
