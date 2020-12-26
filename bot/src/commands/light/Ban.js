const Embed = require("../../structure/Embed");
module.exports = {
  name: "ban",
  description: "",
  aliases: ["حظر", "منع"],
  memberPermissions: "BAN_MEMBERS",
  async exec(message, args) {
    const user = message.mentions.users.first() || await message.client.users.fetch(args[1]).catch(() => undefined);
    let reason = args.slice(2).join(" ");
    const reasonsList = [{ time: "3d", reason: "swearing" }, { time: "5d", reason: "something idk???" }]; // the database getReasons fucking function
    if (message.client.user === user || !args[1] || !user || (message.guild.ownerID !== message.member.user.id && message.guild.member(user) && message.guild.member(user).roles.highest.position >= message.member.roles.highest.position)) return message.react("❌");
    if (reasonsList && !reason) {
      const reasonsEmbed = new Embed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Choose a reason. For ${user}\n\n${reasonsList.map((reason, index) => `${index + 1}. \`\`${reason.time}\`\` | ${reason.reason}`).join("\n")}**`);
      const reply = await message.channel.send(reasonsEmbed);
      const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7, "8️⃣": 8, "9️⃣": 9 };
      for await (const aReason of reasonsList) {
        await reply.react(Object.entries(reactions)[reasonsList.indexOf(aReason)][0]);
      }
      await reply.react("❌");
      const reaction = await reply.awaitReactions((reaction, user) => user === message.member.user, { errors: ["time"], time: 15000, max: 1 }).then(reaction => reaction.first().emoji.name).catch(() => undefined);
      if (reaction === "❌") return reply.delete();
      reason = reasonsList[reactions[reaction]];
      reply.delete();
      if (!reason) {
        return message.react("❌");
      }
    }
    const reaction = await message.guild.members.ban(user, { reason: reason.reason }).then(() => "👍").catch(() => "❌");
    message.react(reaction);
  }
};
