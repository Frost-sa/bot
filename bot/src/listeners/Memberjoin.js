const MemberSchema = require("../../../database/models/Member");
module.exports = {
  name: "guildMemberAdd",
  async exec(member) {
    if (member.guild.me.hasPermission("ADMINISTRATOR")) {
      const invites = await member.guild.fetchInvites();
      const inviter = invites.find(i => member.client.invites[member.guild.id].get(i.code).uses < i.uses).inviter;
      member.client.invites[member.guild.id] = invites;
      if (!inviter) return false;
      const data = await member.getID();
      //if (data.inviter) return false;
      await MemberSchema.findByIdAndUpdate(`${member.user.id}-${member.guild.id}`, { $set: { inviter: inviter.id }});
      await MemberSchema.findByIdAndUpdate(`${inviter.id}-${member.guild.id}`, { $inc: { invites: 1 }});
    }
  }
}