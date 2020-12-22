module.exports = {
  name: "unban",
  description: "",
  aliases: ["فك-الحظر", "فك-المنع"],
  memberPermissions: "ADMINISTRATOR",
  async exec(message, args) {
    const user = message.mentions.users.first() || await message.client.users.fetch(args[1]).catch(() => undefined);
    if (!user || !args || message.client.user === user) return message.react("❌");
    const reaction = await message.guild.members.unban(user.id).then(() => "👍").catch(() => "❌");
    message.react(reaction);
  }
};
