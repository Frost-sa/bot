const Embed = require("../../structure/Embed");
module.exports = {
  name: "roles",
  aliases: ["الرتب"],
  guildOnly: true,
  async exec(message) {
    const Roles = message.guild.roles.cache.array().filter(Role => Role.name !== "@everyone").sort((a, b) => b.position - a.position);
    let currentPage = 0;
    function getEmbed() {
      const rolesEmbed = new Embed();
      rolesEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      rolesEmbed.setFooter(`الصفحة ${currentPage + 1}/${Math.round(Roles.length / 20)}`);
      rolesEmbed.addField("جميع رتب السيرفر", `**${Roles.slice(currentPage * 20, (currentPage * 20) + 20).map((role, index) => `${(currentPage * 20) + index + 1}. \` ${role.name} [${role.members.size} members] ${["ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "VIEW_GUILD_INSIGHTS", "MUTE_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"].find(permission => role.permissions.has(permission)) ? "🔨" : ""} \``).join("\n")}**`);
      return rolesEmbed;
    }
    const theMessage = await message.channel.send(getEmbed());
    if (Math.round(Roles.length / 20) > 1) {
      await theMessage.react("⏮️");
      await theMessage.react("⏭️");
      const ReactionsCollector = await theMessage.createReactionCollector((reaction, user) => ["⏮️", "⏭️"].includes(reaction.emoji.name) && user.id == message.author.id, { time: 60000, errors: ["time"] });
      ReactionsCollector.on("collect", async reaction => {
        await reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
        case "⏭️":
          if (currentPage + 1 === Math.round(Roles.length / 20)) return false;
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
};
