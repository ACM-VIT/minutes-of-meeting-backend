// Markdown routes(CRUD features)

const express = require("express");
const Mom = require("../models/Mom");
const { verifyToken } = require("../middleware/jwt_helper");
const router = express.Router();

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

    return res.json({ moms });
    // console.log(`${moms} this is coming from line 37 `);
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});

// @desc Show single MoM
// @route GET /moms/:id
// eslint-disable-next-line consistent-return
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).populate("user").lean();

    if (!mom) {
      return res.sendStatus(404);
    }
  } catch (err) {
    return res.json({ error: true, message: err.message });
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

    if (!mom) {
      return res.sendStatus(404);
    }

    // console.log(mom);

    // If some other user tries to edit MoM
    // eslint-disable-next-line no-underscore-dangle
    if (mom.user._id !== req.user.id) {
      res.redirect("/dashboard");
    } else {
      return res.json({ mom });
    }
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});

// @desc Update MoM
// @route PUT /moms/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    let mom = Mom.findById(req.params.id).lean();

    if (!mom) {
      res.sendStatus(404);
    }

    // If some other user tries to update MoM
    // eslint-disable-next-line no-underscore-dangle
    if (mom.user._id !== req.user.id) {
      res.redirect("/dashboard");
    } else {
      mom = await Mom.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Delete MoM
// @ route DELETE /moms/:id
// eslint-disable-next-line consistent-return
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).lean();

    if (!mom) {
      res.sendStatus(404);
    }

    // eslint-disable-next-line no-underscore-dangle
    if (mom.user._id !== req.user.id) {
      res.redirect("/moms");
    } else {
      await Mom.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});

// @desc Single user MoMs
// @route GET /moms/user/:userId
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const moms = await Mom.find({
      user: req.params.userId,
    })
      .populate("user")
      .lean();
    // console.log(await Mom.findById("6103029f96bb0f491446c2ac"));
    // console.log(req.params.userId);
    return res.json({ singleUserMoms: moms });
    // console.log(moms);
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});

module.exports = router;
