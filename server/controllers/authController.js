const User = require("../models/userModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

exports.Signup = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail && existingUsername) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error(error);
  }
};

exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ email });
  } catch (error) {
    console.error(error);
  }
};
