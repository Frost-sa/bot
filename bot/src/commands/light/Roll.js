const Embed = require("../../structure/Embed");
module.exports = {
  name: "roll",
  description: "",
  aliases: ["قرعة"],
  guildOnly: true,
  async exec(message, args) {
    const MemberSchema = require("../../../../database/models/Member");
    await MemberSchema.findByIdAndUpdate(`${message.author.id}-${message.guild.id}`, { $inc: { "voiceTime.total": 50000 }})
    let output = Math.random() * 9;
    const range = args[1]
      ? args[1].split("/").join("").split("+")
        .join("")
        .split("*")
        .join("")
        .split("-")
      : null;
    const startAt = range ? Number(range[0]) + 1 : null;
    const endsAt = range ? Number(range[1]) + 1 : null;
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id === args[1]);
    if (endsAt && startAt && args[1].split("-").length < 3) output = Math.floor(Math.random() * (endsAt - startAt)) + startAt;
    output = Math.round(output);
    if ((role && role.members.size < 2) || endsAt < startAt) return message.react("❌");
    await message.react("🎲");
    if (role) output = role.members.random().user.username;
    const rollEmbed = new Embed()
      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(output);
    message.channel.send(rollEmbed);
  }
};
