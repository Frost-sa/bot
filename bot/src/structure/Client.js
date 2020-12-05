const { Client, Intents } = require("discord.js");
const { join } = require("path");
const { readdir } = require("fs");

require("./Structures");

class FrostClient extends Client {
  constructor() {
    super({ ws: { intents: Intents.ALL } });
  }

  __init() {
    this.commandHandler = [];
    this.listenerHandler = [];

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
}

module.exports = FrostClient;
