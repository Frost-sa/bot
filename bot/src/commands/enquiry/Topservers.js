const Embed = require("../../structure/Embed");
const GuildSchema = require("../../../../database/models/Guild");

module.exports = {
  name: "top-servers",
  description: "إظهار المنافسة وإحصائيات السيرفرات.",
  aliases: ["فويس", "topservers", "السيرفرات"],
  async exec(message) {
    const voiceGuilds = this.guilds.cache.map(guild => {
      if (guild.channels.cache.filter(channel => channel.type === "voice").first()) {
        return guild.channels.cache.filter(channel => channel.type === "voice").map(channel => ({
          all: channel.members.size,
          bots: channel.members.filter(member => member.user.bot).size
        })).reduce((a, b) => ({ name: a.name, all: a.all + (b.all || 0), bots: a.bots + (b.bots || 0), id: guild.id }), { all: 0, bots: 0, name: guild.name, id: guild.id });
      }
      return undefined;
    })
      .filter(guild => guild)
      .sort((a, b) => b.all - a.all);
    const textGuilds = (await Promise.all(this.guilds.cache.map(guild => GuildSchema.findById(guild.id))))
      .filter(guild => guild).map(guild => ({
        messages: guild.messages.filter(message => new Date().getTime() - message <= 8.64e+7).length,
        name: this.guilds.cache.get(guild._id).name,
        id: guild._id
      }))
      .sort((a, b) => b.messages - a.messages)
      .map((guild, i) => ({ str: `${guild.id === (message.guild ? message.guild.id : undefined) ? `**${++i}. ${guild.name}**` : `${++i}. ${guild.name}`} \` ${guild.messages} \``, id: guild.id }));
    const memberGuilds = this.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).array();
    message.guild.messages = !textGuilds.find(guild => guild.id === message.guild.id) ? (await GuildSchema.findById(message.guild.id)).messages.filter(message => new Date().getTime() - message <= 8.64e+7).length : undefined;
    const statEmbed = new Embed()
      .setTitle("السيرفرات المتصدرة")
      .addField("الأعلى صوتياً:", voiceGuilds.slice(0, 5).find(guild => guild.id === message.guild.id)
        ? voiceGuilds.slice(0, 5).map((guild, i) => guild.id === message.guild.id ? `**${++i}. ${guild.name}** \` ${guild.all} \`` : `${++i}. ${guild.name} \` ${guild.all} \``)
        : (() => {
          const members = message.guild.channels.cache.filter(channel => channel.type === "voice").map(channel => channel.members.size)
            .reduce((a, b) => a + (b || 0), 0);
          const arr = voiceGuilds.map((guild, i) => guild.id === message.guild.id ? `**${++i}. ${guild.name}** \` ${guild.all} \`` : `${++i}. ${guild.name} \` ${guild.all} \``);
          arr.splice(6, 0, `**${voiceGuilds.indexOf(voiceGuilds.find(guild => guild.id === message.guild.id)) + 1}. ${message.guild.name} \` ${members} \`**`);
          return arr.slice(0, 6);
        })(), true)
      .addField("الأعلى كتابياً:", textGuilds.slice(0, 5).find(guild => guild.id === message.guild.id)
        ? textGuilds.slice(0, 5).map(guild => guild.str)
        : (() => {
          textGuilds.splice(6, 0, { str: `**${textGuilds.indexOf(textGuilds.find(guild => guild.id === message.guild.id)) + 1}. ${message.guild.name} \` ${message.guild.messages} \`**` });
          return textGuilds.map(guild => guild.str);
        })(), true)
      .addField("ㅤ", "ㅤ")
      // .addField("الأعلى دخولاً:", voiceGuilds.map((guild, i) => `**${++i}.** \`${guild.guildName}\` [\`${guild.all}\`]`), true)
      .addField("الأعلى اعضاءً:", memberGuilds.slice(0, 5).find(guild => guild.id === message.guild.id)
        ? memberGuilds.map((guild, i) => guild === message.guild ? `**${++i}. ${guild.name} \` ${guild.memberCount} \`**` : `${++i}. ${guild.name} \` ${guild.memberCount} \``)
          .slice(0, 5)
        : (() => {
          const arr = memberGuilds.map((guild, i) => guild === message.guild ? `**${++i}. ${guild.name} \` ${guild.memberCount} \`**` : `${++i}. ${guild.name} \` ${guild.memberCount} \``)
            .slice(0, 5);
          arr.push(`**${memberGuilds.indexOf(memberGuilds.find(guild => guild.id === message.guild.id)) + 1}. ${message.guild.name} \` ${message.guild.memberCount} \`**`);
          return arr;
        })(), true);
    message.channel.send(statEmbed);
  }
};
