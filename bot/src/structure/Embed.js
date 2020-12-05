const { MessageEmbed } = require("discord.js");

class Embed extends MessageEmbed {
  constructor() {
    super();

    this.setColor("#a0b6e6")
      .setFooter("© 2020, FrostApp.net - All rights reserved.");
  }
}

module.exports = Embed;
