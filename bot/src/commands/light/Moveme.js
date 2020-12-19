module.exports = {
  name: "moveme",
  description: "الانضمام الى روم اخر",
  aliases: ["ودني", "اسحبني"],
  async exec(message, args) {
    const newchannel = (args[1] ? message.guild.channels.cache.get(args[1]) || message.guild.channels.fetch(args[1]).catch(() => undefined) : undefined) || message.mentions.users.first().voice.channel;
    message.member.voice.channel.set(newchannel);
  }
};
