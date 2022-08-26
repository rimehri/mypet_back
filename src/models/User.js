const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Name: { type: String, require: false },

  phone: { type: Number },
 
  password: { type: String, require: false },
 // image: { type: String, default: "avatar.jpeg" },
  resetCode: { type: Number, require: false },
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
