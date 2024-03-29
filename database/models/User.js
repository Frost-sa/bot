const { Schema, model } = require("mongoose");
const UserSchema = Schema({
  _id: String,
  daily: Number,
  coins: Number,
  xp: {
    "type": Number,
    "default": 0
  },
  bio: {
    "type": String,
    "default": "Hello, World!"
  },
  rep: {
    "type": Object,
    "default": {
      likes: 0,
      users: []
    }
  }
});

module.exports = model("User", UserSchema);
