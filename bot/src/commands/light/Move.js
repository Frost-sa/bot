module.exports = {
  name: "move",
  description: "",
  aliases: ["ود", "اسحب"],
  async exec(message, args) {
    const baseMember = await message.guild.getMember(args[1]) || message.mentions.members.first();
    let baseChannel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.type === "voice" && (channel.name.includes(args[1]) || channel.id === args[1]));
    if (baseMember.voice) baseChannel = baseMember.voice.channel;
    const targetMember = await message.guild.getMember(args[2]);
    if (baseMember) {}
    // message.react("❌");message.react("👍");
  }
};
