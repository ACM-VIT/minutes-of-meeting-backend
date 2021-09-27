/* eslint-disable no-underscore-dangle */
// Markdown routes(CRUD features)

const express = require("express");
const Mom = require("../models/Mom");
const User = require("../models/User");
const { verifyToken } = require("../middleware/jwt_helper");
const router = express.Router();

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.find().sort({ createdAt: "desc" });
    const momArr = mom.filter((el) => String(el.user) === req.user.id);
    res.json(momArr);
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc process Add form
// @route POST /moms
router.post("/", verifyToken, async (req, res) => {
  try {
    const mom = req.body;
    mom.user = req.user.id;
    await Mom.create(mom);
    return res.json(mom);
  } catch (err) {
    return console.error(err);
  }
});

// @desc Show all moms (public)
// @route GET /moms
router.get("/", verifyToken, async (req, res) => {
  try {
    const moms = await Mom.find()
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.json({ moms });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Show single MoM
// @route GET /moms/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();
    res.send(mom);
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Edit page
// @route GET /moms/edit/:id
router.get("/edit/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();

    if (!mom) {
      res.sendStatus(404);
      throw new Error("MOM not found");
    }

    // If some other user tries to edit MoM
    if (String(mom.user._id) !== req.user.id) {
      throw new Error("ID doesn't match!");
    } else {
      res.json(mom);
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Update MoM
// @route PUT /moms/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    let mom = await Mom.findById(req.params.id).populate("user").lean();

    if (!mom) {
      res.sendStatus(404);
    }

    if (String(mom.user._id) !== req.user.id) {
      throw new Error("ID doesn't match!");
    } else {
      mom = await Mom.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.json("MOM updated!");
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Delete MoM
// @ route DELETE /moms/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).lean();

    if (!mom) {
      res.sendStatus(404);
    }

    if (String(mom.user._id) !== req.user.id) {
      res.send("Error from 148");
    } else {
      await Mom.remove({ _id: req.params.id });
      res.json("Mom Deleted");
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Single user MOMs
// @route GET /moms/user/:userId
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const moms = await Mom.find({ user: req.params.userId })
      .populate("user")
      .lean();
    res.json(moms);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
