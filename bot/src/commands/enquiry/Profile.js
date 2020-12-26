const { Canvas, resolveImage } = require("canvas-constructor");
const { registerFont } = require("canvas");

registerFont("./bot/src/canvas/fonts/CAIRO-SEMIBOLD.TTF", { family: "Cairo-semibold" });
registerFont("./bot/src/canvas/fonts/CAIRO-REGULAR.TTF", { family: "Cairo-regular" });
registerFont("./bot/src/canvas/fonts/CAIRO-BOLD.TTF", { family: "Cairo-bold" });

module.exports = {
  name: "profile",
  description: "إظهار بروفايل المستخدم لدى فروست.",
  aliases: ["بروفايل", "p", "fid"],
  guildOnly: true,
  async exec(message, args) {
    const user = message.mentions.users.first() || (args[1] ? this.users.cache.get(args[1]) || await this.users.fetch(args[1]).catch(() => undefined) : undefined) || message.author;
    if (user.bot) return;
    const profileImage = await resolveImage("./bot/src/canvas/images/profile.png");
    const backgroundImage = await resolveImage("./bot/src/canvas/images/bg.jpg");
    const userAvatar = await resolveImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
    const { coins, rep, xp, bio } = await user.getProfile();
    const canvas = new Canvas(347, 218)
      .printImage(backgroundImage, 0, 0, 347, 218)
      .printImage(profileImage, 0, 0, profileImage.width, profileImage.height)
      .printCircularImage(userAvatar, 95, 86, 39)
      .setTextFont("30px Cairo-semibold")
      .setTextAlign("center")
      .setColor("#e0e0e0")
      .setTextSize(15)
      .printText(user.username.length > 15 ? `${user.username.slice(0, user.username.length - (user.username.length - 15))}...` : user.username, 95, 144)
      .setColor("#d8d8d8")
      .printText(coins, 270, 80)
      .printText("Developer", 270, 114)
      .setTextSize(10)
      .printText(bio, 95, 157)
      .setTextFont("30px Cairo-bold")
      .setTextSize(25)
      .printText(xp, 191, 84)
      .printText(Math.abs(rep.likes), 191, 136)
      .setTextSize(13)
      .setTextAlign("left")
      .printText(xp, 65, 182)
      .setTextAlign("center")
      .setTextSize(22)
      .printText(rep.likes > 0 ? "+" : rep.likes === 0 ? "" : "-", 174, 136);
    message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: "profile.png" }] });
  }
};


