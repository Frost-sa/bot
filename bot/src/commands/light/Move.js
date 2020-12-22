module.exports = {
  name: "move",
  description: "",
  aliases: ["ود", "اسحب"],
  async exec(message, args) {
    const baseMember = await message.guild.getMember(args[1]) || message.mentions.members.first();
    const baseChannel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.type === "voice" && (channel.name.includes(args[1]) || channel.id === args[1]));
    const targetMember = message.mentions.members.last() || await message.guild.getMember(args[2]);
    let targetChannel = message.mentions.channels.size > 1 ? message.mentions.members.last() : message.guild.channels.cache.find(channel => channel.type === "voice" && (channel.name.includes(args[2]) || channel.id === args[2]));
    if (targetMember && targetMember.voice) targetChannel = targetMember.voice.channel;
    if (!targetChannel || (!baseChannel && !baseMember.voice)) return message.react("❌");
    baseMember && baseMember === args[1] ? baseMember.voice.setChannel(targetChannel) : baseChannel.members.filter(member => !member.user.bot).forEach(member => member.voice.setChannel(targetChannel));
    message.react("👍");
    // i'll leave it for u
  }
};
