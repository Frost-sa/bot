const { Schema, model } = require("mongoose");
const GuildSchema = Schema({
  _id: String,
  prefix: {
    "type": String,
    "default": process.env.PREFIX
  },
  messages: Array,
  warns: Array,
  jail: {
    "type": Object,
    "default": {
      roleID: "",
      prison: []
    }
  }
});

module.exports = model("Guild", GuildSchema);
