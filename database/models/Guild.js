const { Schema, model } = require("mongoose");
const GuildSchema = Schema({
  _id: String,
  prefix: {
    "type": String,
    "default": process.env.PREFIX
  },
  messages: {
    "type": Number,
    "default": 0
  }
});

module.exports = model("Guild", GuildSchema);
