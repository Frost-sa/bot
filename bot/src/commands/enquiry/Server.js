const moment = require("moment");
const GuildSchema = require("../../../../database/models/Guild");
const Embed = require("../../structure/Embed");

moment.locale("ar-kw");

module.exports = {
  name: "server",
  description: "إظهار معلومات السيرفر.",
  aliases: ["سيرفر", "serverinfo", "guild"],
  memberPermissions: ["MANAGE_GUILD"],
  guildOnly: true,
  async exec(message) {
    const { guild } = message;
    const region = {
      "brazil": "` البرازيل ` 🇧🇷",
      "singapore": "` سنغافورة ` 🇸🇬",
      "sydney": "` سيدني ` 🇦🇺",
      "london": "` لندن ` 🇬🇧",
      "amsterdam": "` أمستردام ` 🇳🇱",
      "hongkong": "` هونق كونق ` 🇭🇰",
      "russia": "` روسيا ` 🇷🇺",
      "dubai": "` دبي ` 🇦🇪",
      "frankfurt": "` ألمانيا ` 🇩🇪",
      "southafrica": "` جنوب أفريقيا ` 🇿🇦",
      "india": "` الهند ` 🇮🇳",
      "japan": "` اليابان ` 🇯🇵",
      "south-korea": "` كوريا الجنوبية ` 🇰🇷",
      "eu-central": "` أوروبّا الوسطى ` 🇪🇺",
      "eu-west": "` غرب أوروبا ` 🇪🇺",
      "europe": "` أوروبا ` 🇪🇺",
      "us-central": "` أمريكا الوسطى ` 🇺🇸",
      "us-east": "` شرق أمريكا ` 🇺🇸",
      "us-south": "` جنوب أمريكا ` 🇺🇸",
      "us-west": "` غرب أمريكا ` 🇺🇸"
    };
    const guildSettings = await GuildSchema.findById(guild.id);
    const guildEmbed = new Embed()
      .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ format: "png", dynamic: true }))
      .addField("المنطقة:", region[guild.region], true)
      .addField("مالك السيرفر:", `${guild.owner}`, true)
      .addField("تاريخ إنشاء السيرفر:", `\` ${moment(guild.createdTimestamp).format("DD/MM/YYYY")} (${moment(guild.createdTimestamp).startOf("milliseconds").fromNow()}) \``)
      .addField("احصائيات السيرفر:", `\`\`\`diff\n+ ${guild.memberCount}/${guild.maximumMembers} مجموع الأعضاء\n+ ${guild.members.cache.filter(member => member.hasPermission("MANAGE_MESSAGES")).size} إداريين\n+ ${guild.members.cache.filter(member => member.user.bot).size} بوتات\n+ المتصلين بالفويس ${guild.channels.cache.filter(channel => channel.type === "voice" && channel.members.size > 0).map(channel => channel.members.size).reduce((a, b) => a + b, 0)}\n+ عدد الرومات ${guild.channels.cache.filter(channel => ["text", "voice"].includes(channel.type)).size} (${guild.channels.cache.filter(channel => channel.type === "text").size} كتابي و${guild.channels.cache.filter(channel => channel.type === "voice").size} صوتي)\n+ عدد الرسائل خلال آخر ساعتين ${guildSettings.messages.filter(message => new Date().getTime() - message <= 7.2e+6).length}\`\`\``);
    message.channel.send(guildEmbed);
  }
};
