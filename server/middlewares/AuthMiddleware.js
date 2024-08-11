const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
};

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
      if (err) {
        return next(new Error("Invalid token"));
      }

      const user = await User.findById(decodedToken.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      req.user = user; // Set the user info on the request object
      next(); // Proceed to the next middleware/route handler
    });
  } catch (error) {
    next(error);
  }
};
