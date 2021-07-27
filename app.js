const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const connectDB = require("./config/db");

// Load Config
dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// sessions
app.use(
  session({
    secret: "acta",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// cors
app.use(cors({ origin: "http://localhost:3000/", credentials: true }));

// Body-Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/moms", require("./routes/moms"));
app.get("/login", (req, res) => {
  res.send(req.user);
  console.log(req.user);
  // console.log(res);
});

const PORT = 9000 || process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
