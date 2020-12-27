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
    let hi = hexToRgb(args[1]);
    for (const role of message.guild.roles.cache.array()) { if (role.name.match(/^[0-9]*$/)) { await wait(200); role.delete(); } }
    const rgb = hi.split(",").map(r => Number(r));
    for (let i = 0; i < 10; i++) {
      const r = [];
      r[0] = rgb[0] / (10 - i);
      r[1] = rgb[1] / (10 - i);
      r[2] = rgb[1] / (10 - i);
      await wait(200);
      message.guild.roles.create({
        data: {
          name: i,
          color: (rgbToHex(r[0], r[1], r[2])),
          permissions: 0
        },
        reason: `New Colors Set, ${message.author.tag}`
      });
    }
    return;
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
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return r + "," + g + "," + b;
}