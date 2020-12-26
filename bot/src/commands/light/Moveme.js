module.exports = {
  name: "moveme",
  description: "الانضمام الى روم اخر",
  aliases: ["ودني", "اسحبني"],
  guildOnly: true,
  async exec(message, args) {
    if (!args[1] || !message.member.voice) return message.react("❌");
    const member = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[1]);
    const newchannel = member && member.voice ? member.voice.channel : message.guild.channels.cache.find(channel => channel.type === "voice" && (channel.name.includes(args[1]) || channel.id === args[1]));
    if (!newchannel || !newchannel.permissionsFor(message.member).has("CONNECT") || newchannel === message.member.voice.channel) return message.react("❌");
    message.member.voice.setChannel(newchannel);
    message.react("👍");
  }
};
