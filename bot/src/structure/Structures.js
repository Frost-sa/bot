const { Structures } = require("discord.js");
const GuildSchema = require("../../../database/models/Guild");
const UserSchema = require("../../../database/models/User");

Structures.extend("Message", Message => class extends Message {
  async getPrefix() {
    return new Promise(async resolve => {
      if (this.guild) {
        let guild = await GuildSchema.findById(this.guild.id);
        if (!guild) {
          guild = new GuildSchema({ _id: this.guild.id });
          guild.save();
        }
        guild.messages++;guild.save(); // temp
        return resolve(guild.prefix);
      }
      resolve(process.env.PREFIX);
    });
  }

});

Structures.extend("User", User => class extends User {
  async getProfile() {
    return new Promise(async resolve => {
      let profile = await UserSchema.findById(this.id);
      if (!profile) {
        profile = new UserSchema({
          _id: this.id,
          coins: Math.floor(Math.random() * 100),
          xp: 0,
          bio: "I Like Cheese."
        });
        profile.save();
      }
      resolve(profile);
    });
  }
});