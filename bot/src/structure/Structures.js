const { Structures } = require("discord.js");
const GuildSchema = require("../../../database/models/Guild");
const UserSchema = require("../../../database/models/User");
const MemberSchema = require("../../../database/models/Member");

Structures.extend("Message", Message => class extends Message {
  async getPrefix() {
    return new Promise(async resolve => {
      if (this.guild) {
        let guild = await GuildSchema.findById(this.guild.id);
        if (!guild) {
          guild = new GuildSchema({ _id: this.guild.id });
          guild.save();
        }
        return resolve(guild.prefix);
      }
    });
  }
});

Structures.extend("Guild", Guild => class extends Guild {
  async getMember(id) {
    const member = this.members.cache.get(id) || await this.members.fetch(id).catch(() => undefined);
    return id && id !== this.client.user.id ? member : undefined;
  }
});

Structures.extend("User", User => class extends User {
  async getProfile() {
    return new Promise(async resolve => {
      let profile = await UserSchema.findById(this.id);
      if (!profile) {
        profile = new UserSchema({
          _id: this.id,
          coins: Math.floor(Math.random() * 100)
        });
        profile.save();
      }
      resolve(profile);
    });
  }
});
Structures.extend("GuildMember", Member => class extends Member {
  async getID() {
    return new Promise(async resolve => {
      let ID = await MemberSchema.findById(`${this.user.id}-${this.guild.id}`);
      if (!ID) {
        ID = new MemberSchema({
          _id: `${this.user.id}-${this.guild.id}`,
          textPoints: 0,
          invites: 0,
          inviter: null,
          lastSeen: 0
        });
        ID.save();
      }
      resolve(ID);
    });
  }

  async saveVoiceProgress() {
    if (this.joinedVoice) {
      await MemberSchema.findByIdAndUpdate(`${this.user.id}-${this.guild.id}`, { $inc: { "voiceTime.total": Date.now() - this.joinedVoice } });
      this.joinedVoice = Date.now();
      if (this.joinedVipVoice) {
        await MemberSchema.findByIdAndUpdate(`${this.user.id}-${this.guild.id}`, { $inc: { "voiceTime.vip": Date.now() - this.joinedVipVoice } });
        this.joinedVipVoice = Date.now();
      }
    }
    return Promise.resolve(true);
  }
});
