require("colors");
const wait = require('util').promisify(setTimeout);
module.exports = {
  name: "ready",
  async exec() {
    console.log(`${this.user.tag.rainbow} ${"is ready!".green}`);
    await wait(1000);
    this.invites = {};
    this.guilds.cache.forEach(async g => {
      if (!g.me.hasPermission("ADMINISTRATOR")) return false;
      const invites = await g.fetchInvites();
      this.invites[g.id] = invites;
      console.log (this.user.username)
    });
  }
};

