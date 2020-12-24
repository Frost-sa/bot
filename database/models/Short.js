const { Schema, model } = require("mongoose");
const ShortSchema = Schema({
  _id: String,
  url: String
});

module.exports = model("Short", ShortSchema);
