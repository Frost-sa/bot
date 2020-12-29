const { Client, Intents } = require("discord.js");
const { join } = require("path");
const { readdir } = require("fs");
const { Canvas, resolveImage } = require("canvas-constructor");
const { registerFont } = require("canvas");
const UserSchema = require("../../../database/models/User");
registerFont("./bot/src/canvas/fonts/CAIRO-SEMIBOLD.TTF", { family: "Cairo-semibold" });
require("./Structures");

class FrostClient extends Client {
  constructor() {
    super({ ws: { intents: Intents.ALL } });
  }

  __init() {
    this.commandHandler = [];
    this.listenerHandler = [];
    this.lastLeaderUpdate = 0;
    readdir(join(__dirname, "..", "commands"), (error, folders) => {
      if (error) throw error;

      folders.forEach(folder => {
        readdir(join(__dirname, "..", "commands", folder), (error, files) => {
          if (error) throw error;

          files.filter(file => file.endsWith(".js")).forEach(file => {
            const props = require(`../commands/${folder}/${file}`);
            this.commandHandler.push({ ...props, category: folder });
          });
        });
      });
    });

    readdir(join(__dirname, "..", "listeners"), (error, files) => {
      if (error) throw error;

      files.forEach(file => {
        const props = require(`../listeners/${file}`);
        this.listenerHandler.push(props);

        this.on(props.name, props.exec.bind(this));
      });
    });
  }

  start() {
    this.__init();
    this.login(process.env.TOKEN);
  }

  async updateLeaderBoard() {
    this.lastLeaderUpdate = Date.now();
    const usersData = await UserSchema.find({});
    for (const type of ["coins", "xp"]) {
      const dir = join(__dirname, "../../../", `leaderboards/${type}`);
      require("rimraf").sync(`leaderboards/${type}`);
      require("child_process").execSync(`mkdir leaderboards\\${type}`);
      const icon = await resolveImage(`./leaderboards/icons/${type}.png`);
      if (usersData.length < 100) for (const _ of new Array(100 - usersData.length)) { usersData.push({ _id: this.user.id, coins: 0, xp: 0 }); }
      for (let page = 0; page < 10; page++) {
        const users = usersData.sort((first, second) => second[type] - first[type]).slice(page * 10, (page * 10) + 10);
        const printer = new Canvas(434, 612)
          .printImage(await resolveImage(`./leaderboards/bg/${type}.png`), 0, 0, 434, 612)
          .setTextFont("17px Cairo-semibold")
          .setColor("#e0e0e0")
          .setTextSize(23.5);
        for (const userData of users) {
          const user = await this.users.fetch(userData._id) || this.user;
          const username = user.username.slice(0, 15) + (user.username.length > 14 ? "..." : "");
          const index = users.indexOf(userData);
          printer.printText(`#${(page * 10) + index + 1}`, 14, 132 + (index * 50));
          printer.printImage(await resolveImage(user.displayAvatarURL({ format: "png", size: 4096 })), 52, 103 + (index * 50), 45, 45);
          printer.printText(username, 100, 132 + (index * 50));
          printer.printImage(icon, 340, 132 + (index * 50) - 23, 25, 25);
          printer.setTextAlign("center");
          printer.printText(require("short-number")(userData[type]), 395, 132 + (index * 50));
          printer.setTextAlign("left");
        }
        require("fs").writeFileSync(`${dir}/${page}.png`, printer.toBuffer());
        if (page === 0) Promise.resolve(true);
      }
    }
  }
}

module.exports = FrostClient;
