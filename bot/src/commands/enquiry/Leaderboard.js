const { Canvas, resolveImage } = require("canvas-constructor");
const { registerFont } = require("canvas");
const UserSchema = require("../../../../database/models/User");

registerFont("./bot/src/canvas/fonts/CAIRO-SEMIBOLD.TTF", { family: "Cairo-semibold" });
registerFont("./bot/src/canvas/fonts/CAIRO-REGULAR.TTF", { family: "Cairo-regular" });
registerFont("./bot/src/canvas/fonts/CAIRO-BOLD.TTF", { family: "Cairo-bold" });

module.exports = {
  name: "leaderboard",
  async exec(message) {
    let counter = 0;
    let membersData = (await UserSchema.find({})).sort((a, b) => b.coins - a.coins).slice(0, 10);
    const backgroundImage = await resolveImage("./leaderboards/1.png");
    const coins = await resolveImage("./leaderboards/coins.png");
    const cv = new Canvas(434, 612)
    .printImage(backgroundImage, 0, 0, 434, 612)
    .setTextFont("17px Cairo-semibold")
      .setTextAlign("left")
      .setColor("#e0e0e0")
      .setTextSize(23.5);
      membersData.forEach(m => membersData.push(m));
      membersData = membersData.sort((a, b) => b.coins - a.coins);
    for (let i = 0; i < 10; i++) {
      const memberI = membersData[i];
      if (!memberI) continue;
      const member = await this.users.fetch(memberI._id);
      const userAvatar = await resolveImage(member.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
      cv.printText(`#${i + 1}`, 14, 132 + (i * 50));
      cv.printImage(userAvatar, 52, (125 - 22) + (i * 50), 45, 45);
      cv.printText(member.username.slice(0, 15), 36 + 12 + 52, 125 + 7 + (i * 50));
      cv.printImage(coins, 340, (125 + 7 + (i * 50)) - 23, 25, 25);
      cv.setTextAlign("center");
      cv.printText(require("short-number")(memberI.coins), 368 + 27, 125 + 7 + (i * 50));
      cv.setTextAlign("left");
    }
    return message.channel.send({ files: [cv.toBuffer()] });
    const theMessage = await message.channel.send(getEmbed());
    await theMessage.react("⏮️");
    await theMessage.react("⏭️")
    const reactionsCollector = await theMessage.createReactionCollector((reaction, user) => user.id === message.author.id);
    reactionsCollector.on("collect", async reaction => {
      await reaction.users.remove(message.author);
      switch (reaction.emoji.name) {
      case "⏭️":
        counter++;
        break;
      case "⏮️":
        counter--;
        break;
      }
      theMessage.edit(getEmbed());
    });
  }
};
