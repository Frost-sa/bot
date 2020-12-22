module.exports = {
  name: "vkick",
  description: "",
  memberPermissions: "MOVE_MEMBERS",
  aliases: ["voicekick", "voice-kick"],
  async exec(message, args) {
    const member = message.mentions.members.first() || await message.guild.getMember(args[1]);
    if (!member || !args[1] || !member.voice || message.member === member || member.user.bot) return message.react("❌");
    member.voice.setChannel(null);
    message.react("👍");
  }
};
