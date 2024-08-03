const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: { type: String, require: [true, "Username is required!"] },
  password: { type: String, required: [true, "Your password is required"] },
  createdAt: { type: Date, default: new Date() },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
