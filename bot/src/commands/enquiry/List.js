const Embed = require("../../structure/Embed");
module.exports = {
  name: "list",
  aliases: ["ليست"],
  guildOnly: true,
  async exec(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.name.includes(args[1]) || role.id === args[1]);
    if (!role || !args[1]) return false;
    const members = role.members.array();
    let currentPage = 0;
    function getEmbed() {
      const topEmbed = new Embed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**جميع الأعضاء المالكين لـ ${role.name}\n\n${members.slice(currentPage * 20, (currentPage * 20) + 20).map((member, index) => `${(currentPage * 20) + index + 1}. \` ${member.user.tag} \` : ${{ online: "<:online:791857261176815668>", dnd: "<:dnd:791857261554958347>", idle: "<:idle:791857261436862484>", offline: "<:offline:791857262230503424>" }[member.user.presence.status]} ${member.voice.channel ? "<:connected:791859654036160533>" : ""}`).join("\n")}**`)
        .setFooter("الصفحة " + (currentPage + 1) + "/" + (1 + Math.floor(members.length / 20)));
      return topEmbed;
    }
    const theMessage = await message.channel.send(getEmbed());
    if (Math.round(members.length / 20) > 1) {
      await theMessage.react("⏮️");
      await theMessage.react("⏭️");
      const ReactionsCollector = await theMessage.createReactionCollector((reaction, user) => ["⏮️", "⏭️"].includes(reaction.emoji.name) && user.id == message.author.id, { time: 60000, errors: ["time"]});
      ReactionsCollector.on("collect", async reaction => {
        await reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
        case "⏭️":
          if (currentPage + 1 === Math.floor(members.length / 20)) return false;
          currentPage++;
          break;
        case "⏮️":
          if (currentPage === 0) return false;
          currentPage--;
          break;
        }
        theMessage.edit(getEmbed());
      });
    }
  }
}