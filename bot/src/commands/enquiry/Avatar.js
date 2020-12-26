const Embed = require("../../structure/Embed");

module.exports = {
  name: "avatar",
  description: "إظهار صورة المستخدم.",
  aliases: ["عرض", "صورة", "ava", "av"],
  guildOnly: false,
  async exec(message, args) {
    const user = message.mentions.users.first() || (args[1] ? this.users.cache.get(args[1]) || await this.users.fetch(args[1]).catch(() => undefined) : undefined) || message.author;
    const avatarEmbed = new Embed()
      .setAuthor(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ format: "png", size: 4096, dynamic: true }))
      .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", dynamic: true }));
    message.channel.send(avatarEmbed);
  }
};
