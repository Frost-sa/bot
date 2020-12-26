const Embed = require("../../structure/Embed");

module.exports = {
  name: "jail",
  description: "",
  memberPermissions: "MANAGE_ROLES",
  aliases: ["سجن"],
  guildOnly: true,
  async exec(message, args) {
    const member = message.mentions.members.first() || await message.guild.getMember(args[1]);
    let reason = args.slice(2).join(" ");
    const reasonsList = [{ time: "3d", reason: "swearing" }, { time: "5d", reason: "something idk???" }]; // the database getReasons fucking function
    if (message.guild.member() === member || !args[1] || !member || (message.guild.ownerID !== message.member.user.id && member.roles.highest.position >= message.member.roles.highest.position)) return message.react("❌");
    if (reasonsList && !reason) {
      const reasonsEmbed = new Embed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Choose a reason. For ${member}\n\n${reasonsList.map((reason, index) => `${index + 1}. \`\`${reason.time}\`\` | ${reason.reason}`).join("\n")}**`);
      const reply = await message.channel.send(reasonsEmbed);
      const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7, "8️⃣": 8, "9️⃣": 9 };
      for await (const aReason of reasonsList) {
        await reply.react(Object.entries(reactions)[reasonsList.indexOf(aReason)][0]);
      }
      const reaction = await reply.awaitReactions((reaction, user) => user === message.member.user, { errors: ["time"], time: 15000, max: 1 }).then(reaction => reaction.first().emoji.name).catch(() => undefined);
      reason = reasonsList[reactions[reaction]];
      reply.delete();
      if (!reason) {
        return message.react("❌");
      }
    }
    let role = message.guild.roles.cache.find(role => role.name === "jail");
    if (!role) {
      role = await message.guild.roles.create({ data: { name: "jail" } });
      const { permissions } = role;
      permissions.remove("SEND_MESSAGES");
      await role.setPermissions(2146953215);
    }
    const reaction = await member.roles.add(role, { reason: reason.reason }).then(() => "👍").catch(() => "❌");
    message.react(reaction);
  }
};
