/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
// Markdown routes(CRUD features)

const express = require("express");
const Mom = require("../models/Mom");
const { verifyToken } = require("../middleware/jwt_helper");
const router = express.Router();

// @desc Dashboard
// @route GET /dashboard
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.find().sort({ createdAt: "desc" });
    const momArr = mom.filter((el) => String(el.user) === req.user.id);
    return res.json(momArr);
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "We're sorry, something went wrong." });
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
    return res.status(500).json({
      error: true,
      message: "No information can be sent to the server.",
    });
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

    return res.json({ moms });
  } catch (err) {
    return res.status(404).json({ error: true, message: "No MOM was found!" });
  }
});

// @desc Show single MoM
// @route GET /moms/:id
// eslint-disable-next-line consistent-return
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();
    if (mom === null) {
      return res.status(404).json({ error: true, message: "MOM Not Found!" });
    }
    return res.send(mom);
  } catch (err) {
    return res.status(404).json({ error: true, message: "MOM Not Found!" });
  }
});

// @desc Edit page
// @route GET /moms/edit/:id
// eslint-disable-next-line consistent-return
router.get("/edit/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();

    // If some other user tries to edit MoM
    if (String(mom.user._id) !== req.user.id) {
      throw new Error("ID doesn't match!");
    } else {
      return res.json(mom);
    }
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "User not authorized" });
  }
});

// @desc Update MoM
// @route PUT /moms/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    let mom = await Mom.findById(req.params.id).populate("user").lean();

    if (String(mom.user._id) !== req.user.id) {
      throw new Error("ID doesn't match!");
    } else {
      mom = await Mom.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.json("MOM updated!");
    }
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "User not authorized" });
  }
});

// @desc Delete MoM
// @ route DELETE /moms/:id
// eslint-disable-next-line consistent-return
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).lean();

    if (String(mom.user._id) !== req.user.id) {
      throw new Error("ID doesn't match!");
    } else {
      await Mom.remove({ _id: req.params.id });
      return res.json("Mom Deleted");
    }
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "User not authorized" });
  }
});

// @desc Single user MOMs
// @route GET /moms/user/:userId
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const moms = await Mom.find({ user: req.params.userId })
      .populate("user")
      .lean();
    if (moms.length === 0) {
      return res.status(404).json({ error: true, message: "MOM Not Found" });
    }
    return res.json(moms);
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "User not authorized" });
  }
});

module.exports = router;
