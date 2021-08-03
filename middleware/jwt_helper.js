const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  // eslint-disable-next-line consistent-return
  verifyToken: (req, res, next) => {
    // Check whether authorization header present
    if (!req.headers.authorization)
      return next(createError.Unauthorized(401, "No Bearer token sent"));

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const bearer = bearerToken[0];
    const token = bearerToken[1];

    // Verification
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        // Check whether Bearer starts with "B"
        if (bearer !== "Bearer") {
          return res.status(401).send("Bearer token not sent");
        }

        if (err.name === "JsonWebTokenError") {
          return next(res.status(401).send("Invalid Token"));
        }

        if (err.name === "Bearer null") {
          return next(res.status(401).send("Invalid Token sent"));
        }
      }
      req.payload = payload;

      // User id
      console.log(req.payload.id);
      next();
    });
  },
};
