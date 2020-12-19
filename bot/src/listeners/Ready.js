require("colors");

module.exports = {
  name: "ready",
  exec() {
    console.log(`${this.user.tag.rainbow} ${"is ready!".green}`);
  }
};

