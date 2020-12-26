module.exports = {
  name: "setnick",
  description: "",
  memberPermissions: "CHANGE_NICKNAME",
  aliases: ["نك"],
  guildOnly: true,
  async exec(message, args) {
    let member = message.mentions.members.first();
    const nickname = args.slice(member ? 2 : 1).join(" ");
    member = member || message.member;
    if ((member.user.id !== message.member.user.id && !message.member.hasPermission("MANAGE_NICKNAMES")) || !nickname) return message.react("❌");
    const reaction = await member.setNickname(nickname).then(() => "👍").catch(() => "❌");
    message.react(reaction);
  }
};
