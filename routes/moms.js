// Markdown routes(CRUD features)

const express = require("express");
const User = require("../models/User");
const Mom = require("../models/Mom");
const router = express.Router();

// @desc Add page
// @ route GET /moms/add
router.get("/add", (req, res) => {
  // res.render("moms/add");
});

// @desc process Add form
// @route POST /moms
router.post("/", async (req, res) => {
  try {
    req.body.user = req.user.id;
    await User.create(req.body);
    res.send(req.body.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

// @desc Show all stories (public)
// @ route GET /moms/add
router.get("/", async (req, res) => {
  try {
    const moms = await Mom.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" });

    /* 
    res.render("moms/index", {
      moms
    }) */
  } catch (err) {
    console.error(err);
    // res.render("error/500")
  }
});

// @desc Edit page
// @ route GET /moms/edit/:id
router.get("/edit/:id", async (req, res) => {
  const mom = await Mom.findOne({
    _id: req.params.id,
  });

  if (!mom) {
    // return res.render("error/404")
  }

  // If some other user tries to edit MoM
  if (mom.user !== req.user.id) {
    res.redirect("/moms");
  } else {
    /*
    res.render("moms/edit", {
      mom
    }) */
  }
});

// @desc Update MoM
// @ route PUT /moms/:id
router.put("/:id", async (req, res) => {
  let mom = Mom.findById(req.params.id);

  if (!mom) {
    // return res.render("error/404")
  }

  // If some other user tries to update MoM
  if (mom.user !== req.user.id) {
    res.redirect("/moms");
  } else {
    mom = await Mom.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect("/dashboard");
  }
});

module.exports = router;
