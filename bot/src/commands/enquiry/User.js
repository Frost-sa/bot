const moment = require("moment");
const Embed = require("../../structure/Embed");

moment.locale("ar-kw");

module.exports = {
  name: "user",
  description: "إظهار معلومات المستخدم وسيرفراته.",
  aliases: ["يوزر", "userinfo", "userid"],
  async exec(message, args) {
    const colors = { online: "#43b581", idle: "#faa61a", dnd: "#f04747", offline: "#747f8d" };
    const device = { web: "متصفح", mobile: "جوال", desktop: "بي سي" };
    const user = message.mentions.users.first() || (args[1] ? this.users.cache.get(args[1]) || await this.users.fetch(args[1]).catch(() => undefined) : undefined) || message.author;
    const mutualGuilds = (await Promise.all(this.guilds.cache.map(async guild => {
      const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => undefined);
      if (member) {
        const voiceChannel = guild.channels.cache.find(channel => channel.type === "voice" && channel.members.get(user.id));
        return `${member.hasPermission("MANAGE_MESSAGES") ? "-" : "+"} ${guild.name}${voiceChannel ? ` => 🔊 ${voiceChannel.name}` : ""}`;
      }
    }))).filter(guild => guild).reduce((arr, element, i) => {
      const chunkIndex = Math.floor(i / 5);
      if (!arr[chunkIndex]) {
        arr[chunkIndex] = [];
      }
      arr[chunkIndex].push(element);
      return arr;
    }, []);
    let currentPage = 0;
    const generateEmbed = () => new Embed()
      .setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }))
      .addField("تاريخ الانضمام للديسكورد:", `\` ${moment(user.createdTimestamp).format("DD/MM/YYYY")} (${moment(user.createdTimestamp).startOf("milliseconds").fromNow()})\``, true)
      .addField("متصل من:", `\`${user.presence.clientStatus ? Object.keys(user.presence.clientStatus).map(key => device[key]).join(" و") : "غير معروف"}\``, true)
      .addField("السيرفرات المشتركة:", mutualGuilds.length ? `\`\`\`diff\n${mutualGuilds[currentPage].join("\n")}\`\`\`` : "```diff\n+ لا توجد سيرفرات مشتركة```")
      .setColor(colors[user.presence.status]);
    message.channel.send(generateEmbed()).then(async msg => {
      if (mutualGuilds.length < 2) return;
      await msg.react("⬅️");
      await msg.react("➡️");
      const collector = await msg.createReactionCollector((reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === message.author.id, {
        time: 1000 * 60,
        errors: ["time"]
      });
      collector.on("collect", reaction => {
        if (message.guild) reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
        case "⬅️":
          if (currentPage > 0) currentPage -= 1;
          break;
        case "➡️":
          if (currentPage < mutualGuilds.length - 1) currentPage += 1;
          break;
        }
        msg.edit(generateEmbed());
      });
    });
  }
};
