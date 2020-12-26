const Embed = require("../../structure/Embed");
module.exports = {
  name: "mlist",
  aliases: ["listm"],
  guildOnly: true,
  async exec(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.name.includes(args[1]) || role.id === args[1]);
    if (!role || !args[1]) return false;
    const members = role.members.array();
    let currentPage = 0;
    function getContent() {
      return `**Page: ${(currentPage + 1) + "/" + (1 + Math.floor(members.length / 10))}\nTotal: ${members.length}**\n\n${members.slice(currentPage * 10, (currentPage * 10) + 10).map((member, index) => `**${(currentPage * 10) + index + 1}.${member.user} : ${{ online: "<:online:791857261176815668>", dnd: "<:dnd:791857261554958347>", idle: "<:idle:791857261436862484>", offline: "<:offline:791857262230503424>" }[member.user.presence.status]} ${member.voice.channel ? "<:connected:791859654036160533>" : ""}**`).join("\n")}`;
    }
    const theMessage = await message.channel.send("Ping");
    theMessage.edit(getContent());
    if (Math.round(members.length / 10) > 1) {
      await theMessage.react("⏮️");
      await theMessage.react("⏭️");
      const ReactionsCollector = await theMessage.createReactionCollector((reaction, user) => ["⏮️", "⏭️"].includes(reaction.emoji.name) && user.id == message.author.id, { time: 60000, errors: ["time"]});
      ReactionsCollector.on("collect", async reaction => {
        await reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
        case "⏭️":
          if (currentPage + 1 === Math.floor(members.length / 10)) return false;
          currentPage++;
          break;
        case "⏮️":
          if (currentPage === 0) return false;
          currentPage--;
          break;
        }
        theMessage.edit(getContent());
      });
    }
  }
}