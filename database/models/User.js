const { Schema, model } = require("mongoose");
const UserSchema = Schema({
  _id: String,
  coins: Number,
  xp: Number,
  bio: String,
  rep: {
    "type": Object,
    "default": {
      reps: 0,
      likedUsers: []
    }
  }
});

module.exports = model("User", UserSchema);
