const { Schema, model } = require("mongoose");
const MemberSchema = Schema({
  _id: String, // and you can make the id something like: `${guild.id}-${member.id}` understand?
  voiceTime: {
    "type": Object,
    "default": {
      total: 0,
      vip: 0
    }
  },
  textPoints: Number,
  invites: Number,
  inviter: String,
  lastSeen: Number
});
module.exports = model("Member", MemberSchema);