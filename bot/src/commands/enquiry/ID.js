const Embed = require("../../structure/Embed");
const moment = require("moment");
moment.locale("ar-kw");
const MemberSchema = require("../../../../database/models/Member");

module.exports = {
  name: "id",
  description: "إظهار معلومات العضو في السيرفر.",
  aliases: ["idenity", "هوية"],
  async exec(message, args) {
    let member = message.mentions.members.first() || await message.guild.getMember(args[1]);
    if (!member || !args[1]) member = message.member;
    const memberInfo = await member.getID();
    const membersData = (await MemberSchema.find({})).filter(Member => Member._id.endsWith(`-${message.guild.id}`));
    const voiceRank = membersData.sort((a, b) => b.voiceTime.total - a.voiceTime.total).map(Member => JSON.stringify(Member)).indexOf(JSON.stringify(memberInfo)) + 1;
    const textRank = membersData.sort((a, b) => b.textPoints - a.textPoints).map(Member => JSON.stringify(Member)).indexOf(JSON.stringify(memberInfo)) + 1;
    const vipVoiceRank = membersData.sort((a, b) => b.voiceTime.vip - a.voiceTime.vip).map(Member => JSON.stringify(Member)).indexOf(JSON.stringify(memberInfo)) + 1;
    const invitesRank = membersData.sort((a, b) => b.invites - a.invites).map(Member => JSON.stringify(Member)).indexOf(JSON.stringify(memberInfo)) + 1;
    const idenityEmbed = new Embed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dyanmic: true }))
      .addField("التواجد", `**#${memberInfo.voiceTime.total == 0 ? 0 : voiceRank}** | **\`${memberInfo.voiceTime.total == 0 ? "Not seen yet." : require("ms")(memberInfo.voiceTime.total)}\`**`);
    if (memberInfo.voiceTime.vip !== 0) idenityEmbed.addField("التواجد بالرومات العليا", `**#${vipVoiceRank} **| **\`${require("ms")(memberInfo.voiceTime.vip)}\`**`);
    idenityEmbed.addField("التفاعل الكتابي", `**#${memberInfo.textPoints == 0 ? 0 : textRank}** | **\`${memberInfo.textPoints} points\`**`);
    idenityEmbed.addField("الدعوات", `**#${memberInfo.invites == 0 ? 0 : invitesRank}** | **\`${memberInfo.invites} members\`**`);
    idenityEmbed.addField("الداعي", `<@!${memberInfo.inviter || member.guild.ownerID}>`, true);
    if (member.roles.highest.name != '@everyone') idenityEmbed.addField("الرتبة", `${member.roles.highest}`, true);
    idenityEmbed.addField("اخر ظهور", `**${member.voice.channel ? "متصل الآن" : memberInfo.lastSeen ? moment(memberInfo.lastSeen).startOf("milliseconds").fromNow() : "لم يتصل"}**`, true);
    message.channel.send(idenityEmbed);
  }
} 
