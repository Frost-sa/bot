const Embed = require("../../structure/Embed");
const GuildSchema = require("../../../../database/models/Guild");

module.exports = {
  name: "warns",
  description: "",
  aliases: ["تحذيرات"],
  memberPermissions: "ADMINISTRATOR",
  async exec(message, args) {
    const member = args[1] ? message.mentions.members.first() || await message.guild.getMember(args[1]) : message.member;
    if (message.guild.member(message.client.user) === member) return message.react("❌");
    const memberWarns = (await GuildSchema.findById(message.guild.id)).warns.filter(warn => warn.member === member.id).map(warn => warn.reason);
    const warnsEmbed = new Embed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
      .addField("إنذارات العضو:", `\`\`\`fix\n${memberWarns.length > 0 ? memberWarns.map((reason, i) => `${i + 1} > ${reason}`).join("\n") : "No Warns"}\`\`\``)
      .setThumbnail(message.guild.iconURL({ dynamic: true }));
    message.channel.send(warnsEmbed);
  }
};
