const mongoose = require("mongoose");
// const Acm_member = require("../models/Acm_member");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		// mongoose.set("useCreateIndex", true);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;
