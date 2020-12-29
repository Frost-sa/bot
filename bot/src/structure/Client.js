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
    this.lastLeaderUpdate = Date.now();
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
    const usersData = await UserSchema.find({});
    for (const type of ["coins", "xp"]) {
      const dir = `${__dirname}/leaderboards/${type}`;
      require("fs").rmdirSync(dir);
      require("fs").mkdirSync(dir);
      for (let page = 0; page < 10; page++) {
        const users = usersData.sort((first, second) => second[type] - first[type]).slice(page * 10, page * 10 + 10);
        const printer = new Canvas(434, 612)
          .printImage(await resolveImage(`./leaderboards/bg/${type}`, 0, 0, 434, 612))
          .setTextFont("17px Cairo-semibold")
          .setColor("#e0e0e0")
          .setTextSize(23.5);
        users.forEach(async (userData, index) => {
          const user = await this.users.fetch(userData._id);
          printer.printText(`#${(page * 10) + users.indexOf(userData)}`, 14, 132 + index * 50);
          printer.printImage(await resolveImage(user.displayAvatarURL({ format: "png", size: 128 })), 52, 103 + (index * 50), 45, 45);
        });
        
      }
    }
  };

}

module.exports = FrostClient;
