const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  insta: { type: String, required: false },
  photo: { type: String, required: false }, // Add this field for photo URL
  age: { type: Number, required: true }, // Added Age field
  bio: { type: String, required: false }, // Added Bio field
});

const userModel = mongoose.model("users", usersSchema);
module.exports = userModel;
 