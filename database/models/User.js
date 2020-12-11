const { Schema, model } = require("mongoose");
const UserSchema = Schema({
  _id: String,
  coins: Number,
  xp: Number,
  bio: String,
  rep: {
    "type": Object,
    "default": {
      likes: 0,
      users: []
    }
  }
});

module.exports = model("User", UserSchema);
