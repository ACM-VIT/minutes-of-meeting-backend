const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
// const flash = require("connect-flash");
const bodyParser = require("body-parser");
// const showdown = require("showdown");
const MongoStore = require("connect-mongo");
const cors = require("cors");

// convertRouter = require("./routes/index");

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

// app.use(flash());

// Routes
app.use("/", require("./routes/"));
app.use("/auth", require("./routes/auth"));
// app.use("/convert", convertRouter);

// Body-Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cors
app.use(cors());

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
