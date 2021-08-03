const jwt = require("jsonwebtoken");

module.exports = {
  // eslint-disable-next-line consistent-return
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check whether authorization header present
    if (!authHeader) {
      return res.status(401).send("No Bearer token sent");
    }
    const bearerToken = authHeader.split(" ");
    const bearer = bearerToken[0];
    const token = bearerToken[1];

    // Check whether Bearer starts with "B"
    if (bearer !== "Bearer") {
      return res.status(401).send("Token not authorized with Bearer");
    }

    // Verification
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).send("Invalid token sent");
        }
      }
      req.payload = payload;

      // User id
      const userId = req.payload.id;
      console.log({ "userId after token verification": userId });
      next();
    });
  },
};
