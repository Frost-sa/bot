const Embed = require("../../structure/Embed");
const GuildSchema = require("../../../../database/models/Guild");

module.exports = {
  name: "topservers",
  description: "إظهار المنافسة وإحصائيات السيرفرات.",
  aliases: ["فويس", "السيرفرات", "top-servers"],
  guildOnly: false,
  async exec(message) {
    const guildsData = await GuildSchema.find({});
    const voiceGuilds = this.guilds.cache.map(guild => {
      const channels = guild.channels.cache.filter(channel => channel.type === "voice").array().map(channel => channel.members.size);
      let totalMembers = 0;
      channels.forEach(channel => totalMembers += channel);
      guild.voiceMembers = totalMembers;
      guild.messages = guild.messages || [];
      return guild;
    }).sort((a, b) => b.voiceMembers - a.voiceMembers);
    const textGuilds = guildsData.map(guild => {
      guild.messages = guild.messages.filter(message => (Date.now() - message) < 2 * 60 * 60 * 1000);
      return guild;
    }).sort((a, b) => b.messages.length - a.messages.length);
    textGuilds.forEach(guild => guild.forText = true);
    const getContent = (guild, index) => {
      const guildName = this.guilds.cache.get(guild.id);
      return `${message.guild && guild.id === message.guild.id ? "**" : ""} ${index + 1}. ${guildName} | \` ${guild.forText ? guild.messages.length : guild.voiceMembers} \`${message.guild && guild.id === message.guild.id ? "**" : ""}`;
    };
    const guildFilter = guild => message.guild && guild.id === message.guild.id;
    const voiceGuild = voiceGuilds.find(guildFilter);
    const textGuild = textGuilds.find(guildFilter);
    const statsEmbed = new Embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dyanmic: true }))
      .setTitle("السيرفرات المتصدرة")
      .addField("الأعلى صوتياً :", `${voiceGuilds.slice(0, 5).map(getContent).join("\n")} ${voiceGuild ? `\n${getContent(voiceGuild, voiceGuilds.indexOf(voiceGuild) + 1)}` : ""}`, true)
      .addField("الأعلى كتابياً :", `${textGuilds.slice(0, 5).map(getContent).join("\n")} ${textGuilds.indexOf(textGuild) > 4 ? `\n${getContent(textGuild, textGuilds.indexOf(textGuild) + 1)}` : ""}`, true);
    message.channel.send(statsEmbed);
  }
};
