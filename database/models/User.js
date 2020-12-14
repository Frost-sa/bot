const { Schema, model } = require("mongoose");
const UserSchema = Schema({
  _id: String,
  coins: Number,
  xp: {
    "type": Number,
    "default": 0
  },
  bio: {
    "type": String,
    "default": "I like cheese."
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
