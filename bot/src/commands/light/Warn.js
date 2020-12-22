const GuildSchema = require("../../../../database/models/Guild");
const Embed = require("../../structure/Embed");
module.exports = {
  name: "warn",
  description: "",
  aliases: ["تحذير", "حذر"],
  memberPermissions: "ADMINISTRATOR",
  async exec(message, args) {
    const member = message.mentions.members.first() || await message.guild.getMember(args[1]);
    const reason = args.slice(2).join(" ").slice(0, 150) || "No reason specified.";
    const warnEmbed = new Embed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dyanmic: true }))
      .setDescription(`**لقد تم تحذيرك من قبل ${message.author.username}\nللسبب: \`\`${reason}\`\`**`);
    if (message.guild.member(message.client.user) === member || !member || !args[1] || message.member === member) return message.react("❌");
    await GuildSchema.findByIdAndUpdate(message.guild.id, { $push: { warns: { member: member.id, reason, warnedBy: message.author.id } } });
    message.react("👍");
    member.send(warnEmbed);
  }
};
