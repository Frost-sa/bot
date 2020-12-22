const Embed = require("../../structure/Embed");
module.exports = {
  name: "kick",
  description: "",
  aliases: ["طرد"],
  memberPermissions: "KICK_MEMBERS",
  async exec(message, args) {
    const member = message.mentions.members.first() || await message.guild.getMember(args[1]);
    let reason = args.slice(2).join(" ");
    const reasonsList = ["some reason", "another", "just for test", "another test hahaha", "again"]; // the database getReasons fucking function
    if (message.guild.member(message.client.user) === member || !args[1] || !member || (message.guild.ownerID !== message.member.user.id && member.roles.highest.position >= message.member.roles.highest.position)) return message.react("❌");
    if (reasonsList && !reason) {
      const reasonsEmbed = new Embed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Choose a reason. For ${member}\n\n${reasonsList.map((reason, index) => `${index + 1}. ${reason}`).join("\n")}**`);
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
    const reaction = await member.kick({ reason: reason.reason }).then(() => "👍").catch(() => "❌");
    message.react(reaction);
  }
};
