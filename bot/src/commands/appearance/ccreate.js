/* eslint-disable max-statements-per-line */
const wait = require("util").promisify(setTimeout);
// const hexRgb = require('hex-rgb');
// const colorGen = require("color-palette-generator"); colorGen(`#${args[2]}`, args[1]); console.log(colortheme) ||
// const colors = require("nice-color-palettes");

module.exports = {
  name: "colorcreate",
  description: "انشاء علبة الوان جديدة",
  aliases: ["cc", "ccreate", "علبة", "علبة جديدة"],
  cooldown: 30000,
  guildOnly: true,
  async exec(message, args) {
    if (!args[1] || args[1] < 1 || args[1] > 75) return message.react("❌");
    await message.react("🖌️");
    for (const role of message.guild.roles.cache.array()) { if (role.name.match(/^[0-9]*$/)) { await wait(200); role.delete(); } }
    const colortheme = "RANDOM";
    for (let i = 1; i <= args[1]; i++) {
      await wait(200);
      message.guild.roles.create({
        data: {
          name: i,
          color: colortheme[i],
          permissions: 0
        },
        reason: `New Colors Set, ${message.author.tag}`
      });
    }
    await message.reactions.removeAll(); await message.react("✅");
  }
};
