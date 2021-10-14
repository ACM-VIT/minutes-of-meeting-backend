const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Passport middleware
app.use(passport.initialize());

// cors
app.use(cors());
app.options("*", cors());

// Body-Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set global var (used in routes)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/moms", require("./routes/moms"));

const PORT = 9000 || process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
