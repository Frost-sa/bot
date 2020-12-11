const Embed = require("../../structure/Embed");

module.exports = {
  name: "top servers",
  description: "إظهار المنافسة وإحصائيات السيرفرات.",
  aliases: ["فويس", "topservers", "السيرفرات"],
  exec(message) {
    const voiceGuilds = this.guilds.cache.map(guild => {
      if (guild.channels.cache.filter(channel => channel.type === "voice" && channel.members.first()).first()) {
        return guild.channels.cache.filter(channel => channel.type === "voice" && channel.members.first()).map(channel => {
          if (channel.type !== "voice") return undefined;
          return {
            all: channel.members.size,
            bots: channel.members.filter(member => member.user.bot).size
          };
        }).reduce((a, b) => ({ guildName: a.guildName, all: a.all + (b.all || 0), bots: a.bots + (b.bots || 0) }), { all: 0, bots: 0, guildName: guild.name });
      }
      return undefined;
    })
      .filter(guild => guild)
      .sort((a, b) => b.all - a.all)
      .slice(0, 10);
    const statEmbed = new Embed()
      .setTitle("السيرفرات المتصدرة.")
      .addField("الأعلى صوتياً:", voiceGuilds.map((guild, i) => `**${++i}.** \`${guild.guildName}\` [\`${guild.all}\`]: [\`${guild.bots} Bots\`]`), true)
      .addField("الأعلى كتابياً:", voiceGuilds.map((guild, i) => `**${++i}.** \`${guild.guildName}\` [\`${guild.all}\`]`), true)
      .addField("ㅤ", "ㅤ")
      .addField("الأعلى دخولاً:", voiceGuilds.map((guild, i) => `**${++i}.** \`${guild.guildName}\` [\`${guild.all}\`]`), true)
      .addField("الأعلى اعضاءً:", voiceGuilds.map((guild, i) => `**${++i}.** \`${guild.guildName}\` [\`${guild.all}\`]`), true);
    message.channel.send(statEmbed);
  }
};
