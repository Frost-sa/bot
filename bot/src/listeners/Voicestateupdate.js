const MemberSchema = require("../../../database/models/Member");
module.exports = {
  name: "voiceStateUpdate",
  async exec(Oldstate, Newstate) {
    const member = Newstate.member;
    if (member.user.bot) return false;
    const vipVoice = ["789916236770967584"];
    if (!Oldstate.channel && Newstate.channel) {
      if (vipVoice.includes(Newstate.channel.id)) member.joinedVipVoice = Date.now();
      member.joinedVoice = Date.now();
    }
    if (Oldstate.channel && Newstate.channel) {
      if (!vipVoice.includes(Oldstate.channel.id) && vipVoice.includes(Newstate.channel.id)) member.joinedVipVoice = Date.now();
      if (vipVoice.includes(Oldstate.channel.id) && !vipVoice.includes(Newstate.channel.id) && member.joinedVipVoice) {
        await MemberSchema.findByIdAndUpdate(`${member.user.id}-${member.guild.id}`, { $inc: { "voiceTime.vip": Date.now() - member.joinedVipVoice}});
        member.joinedVipVoice = false;
      }
    }
    if (Oldstate.channel && !Newstate.channel) {
      await member.getID();
      if (member.joinedVoice) {
        await MemberSchema.findByIdAndUpdate(`${member.user.id}-${member.guild.id}`, { $inc: { "voiceTime.total": Date.now() - member.joinedVoice}});
        member.joinedVoice = false;
      }
      if (member.joinedVipVoice) {
        await MemberSchema.findByIdAndUpdate(`${member.user.id}-${member.guild.id}`, { $inc: { "voiceTime.vip": Date.now() - member.joinedVipVoice}});
        member.joinedVipVoice = false;
      }
      await MemberSchema.findByIdAndUpdate(`${member.user.id}-${member.guild.id}`, { $set: { lastSeen: Date.now() }});
    }
  }
}

