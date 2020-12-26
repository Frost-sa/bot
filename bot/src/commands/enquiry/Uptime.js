const Embed = require("../../structure/Embed");
module.exports = {
  name: "uptime",
  aliases: ["وقت-التشغيل"],
  guildOnly: false,
  async exec(message, args) {
    const uptimeEmbed = new Embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`**وقت التشغيل مُنذ آخر صيانة\n\`\`\`fix\nUptime: ${require("ms")(Date.now () - message.client.readyTimestamp)}\nUp Since: ${require("moment")(message.client.readyTimestamp).locale("ar-kw").format("YYYY/MM/DD HH:MM:SS a")}\`\`\`**`)
      .setFooter(message.client.user.username, message.client.user.displayAvatarURL({ dynamic: true }));
    const theMessage = await message.channel.send(uptimeEmbed);
  }
};
