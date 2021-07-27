// Markdown routes(CRUD features)

const express = require("express");
const User = require("../models/User");
const router = express.Router();

// @desc Add MoM
// @ route GET /moms/add
router.get("/add", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// @desc process Add form
// @route POST /moms
router.post("/", async (req, res) => {
  try {
    req.body.user = req.user.id;
    await User.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
