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
    // res.redirect("/dashboard");
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
    // return {
    //   moms: moms,
    // };
    // console.log(`${moms} this is coming from line 37 `);

    /* 
    res.render("moms/index", {
      moms
    }) */
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// @desc Show single MoM
// @route GET /moms/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).populate("user").lean();

    if (!mom) {
      res.sendStatus(404);
    }
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
    }

    // console.log(mom);

    // If some other user tries to edit MoM
    // eslint-disable-next-line no-underscore-dangle
    if (mom.user._id !== req.user.id) {
      res.redirect("/dashboard");
    } else {
      res.json({ mom });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
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
    res.json({ error: true, message: err.message });
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
    console.log(await Mom.findById("6103029f96bb0f491446c2ac"));
    console.log(req.params.userId);
    res.json({ singleUserMoms: moms });
    // console.log(moms);

    /*
    res.render('moms/index', {
      moms,
    }); */
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

module.exports = router;
