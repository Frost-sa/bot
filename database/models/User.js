const { Schema, model } = require("mongoose");
const UserSchema = Schema({
  _id: String,
  coins: Number,
  xp: Number,
  bio: String,
  rep: {
    "type": Number,
    "default": 0
  }
});

module.exports = model("User", UserSchema);
