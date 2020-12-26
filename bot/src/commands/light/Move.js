module.exports = {
  name: "move",
  description: "",
  aliases: ["ود", "اسحب"],
  memberPermissions: ["MOVE_MEMBERS"],
  async exec(message, args) {
    const baseMember = message.mentions.members.first() || await message.guild.getMember(args[1]);
    const targetMember = args[2] ? await message.guild.getMember(args[2]) || message.mentions.members.array()[1] : undefined;
    const targetChannel = message.guild.channels.cache.find(channel => channel.type === "voice" && (channel.name.includes(args[2]) || channel.id === args[2]));
    if (!args[1] || !args[2] || !baseMember || (!targetMember && !targetChannel) || !baseMember.voice) return message.react("❌");
    if ((baseMember && !baseMember.voice) || (targetMember && !targetMember.voice)) return message.react("❌");
    baseMember.voice.setChannel(targetMember ? targetMember.voice.channel : targetChannel);
    message.react("👍");
  }
};
