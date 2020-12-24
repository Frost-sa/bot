const Embed = require("../../structure/Embed");
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "colorcreate",
  description: "انشاء علبة الوان جديدة",
  aliases: ["cc", "ccreate", "علبة","علبة جديدة"],
  cooldown: 30000,
  async exec(message, args) {
    if (!args[1] || args[1] < 1 || args[1] > 75) return message.react('❌');
    await message.react('🖌️');
    for (var role of message.guild.roles.cache.array()) { if (role.name.match(/^[0-9]*$/)) { await wait(200); role.delete() } };
    for (var i = 1; i <= args[1]; i++){
      await wait(200);
      message.guild.roles.create({
        data: {
          name: i,
          color: args[2] || 'RANDOM',
          permissions: 0,
        },
        reason: `New Colors Set, ${message.author.tag}`,
      })
    } 
    await message.reactions.removeAll(); await message.react('✅');
  }
};
