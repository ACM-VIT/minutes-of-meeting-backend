const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc    Auth with google
// @route   GET /auth/google

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    goolge Auth callback
// @route   GET /auth/goolge/callback

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "http://localhost:3000/autherror",
	}),
	(req, res) => {
		res.redirect("http://localhost:3000");
	}
);

// @desc    Logout User
// route    /auth/logout

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("http://localhost:3000");
});

module.exports = router;
