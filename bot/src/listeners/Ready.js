require("colors");
const GuildSchema = require("../../../database/models/Guild");

module.exports = {
  name: "ready",
  exec() {
    console.log(`${this.user.tag.rainbow} ${"is ready!".green}`);
  }
};

