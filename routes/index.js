// ACM Members

const express = require("express");
const router = express.Router();

// testing
router.get("/", async (req, res) => {
  res.send("API working properly!");
});

module.exports = router;
