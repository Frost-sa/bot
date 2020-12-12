const { Schema, model } = require("mongoose");
const GuildSchema = Schema({
  _id: String,
  prefix: {
    "type": String,
    "default": process.env.PREFIX
  },
  messages: {
    "type": Array,
    "default": []
  }
});

module.exports = model("Guild", GuildSchema);
