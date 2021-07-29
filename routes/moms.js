// Markdown routes(CRUD features)

const express = require("express");
const Mom = require("../models/Mom");
const router = express.Router();

// @desc Add page
// @route GET /moms/add
router.get("/add", (req, res) => {
  // res.render("moms/add");
});

// @desc process Add form
// @route POST /moms
router.post("/", async (req, res) => {
  try {
    // req.body.user = req.user.id;
    await Mom.create(req.body);
    // res.redirect("/dashboard");
    res.send(req.body);
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

// @desc Show all moms (public)
// @route GET /moms/add
router.get("/", async (req, res) => {
  try {
    const mom = await Mom.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" });

    /* 
    res.render("moms/index", {
      moms
    }) */
  } catch (err) {
    console.error(err);
    // res.render("error/500");
  }
});

// @desc Show single MoM
// @route GET /moms/:id
router.get("/:id", async (req, res) => {
  try {
    const mom = await Mom.findById(req.params.id).populate("user");

    if (!mom) {
      // return res.render("error/404");
    }

    /*
    res.render("moms/show", {
      mom
    }); */
  } catch (err) {
    console.error(err);
    // return res.render("error/404");
  }
});

// @desc Edit page
// @route GET /moms/edit/:id
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
// @route PUT /moms/:id
router.put("/:id", async (req, res) => {
  try {
    let mom = Mom.findById(req.params.id);

    if (!mom) {
      // return res.render("error/404");
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
  } catch (err) {
    console.error(err);
    // return res.render("error/500");
  }
});

// @desc Delete MoM
// @ route DELETE /moms/:id
router.get("/:id", async (req, res) => {
  try {
    await Mom.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    // return res.render("error/500");
  }
});

module.exports = router;
