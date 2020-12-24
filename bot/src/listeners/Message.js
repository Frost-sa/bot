const axios = require("axios").default;
const GuildSchema = require("../../../database/models/Guild");
const MemberSchema = require("../../../database/models/Member");
const wait = require('util').promisify(setTimeout);
const cooldown = [];


module.exports = {
  name: "message",
  async exec(message) {
    if (message.author.bot) return;
    message.prefix = await message.getPrefix();
    message.react = reaction => wait(200).then(() => axios.put(`https://discord.com/api/v8/channels/${message.channel.id}/messages/${message.id}/reactions/${encodeURI(reaction)}/%40me`, {}, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`
      }
    }));
    await message.member.getID();
    await MemberSchema.findByIdAndUpdate(`${message.author.id}-${message.guild.id}`, { $inc: { textPoints: 1 }});
    const args = message.content.slice(message.prefix.length).split(" ");
    const command = this.commandHandler.find(command => command.name === args[0].toLowerCase() || command.aliases.includes(args[0].toLowerCase()));
    if (command && message.content.startsWith(message.prefix)) {
      let defaultCooldown = command.cooldown || 2000;
      if (cooldown.find(person => person.command === command.name && person.user === message.author.id)) return message.react("🤌").then(() => message.delete({ timeout: 2000 }).catch(() => undefined));
      if (command.turboOnly && !process.env.TURBO) return;
      if (process.env.TURBO && !command.cooldown) defaultCooldown = 0;
      if (command.guildOnly && !message.guild) return message.react("❌");
      if (message.guild) {
        if (command.memberPermissions && !message.member.hasPermission(command.memberPermissions)) return;
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("** ليس لدي الصلاحيات الكافية 🙄 **").catch(console.log);
      }
      if (!command.cooldown) {
        cooldown.push({ command: command.name, user: message.author.id });
        setTimeout(() => cooldown.splice(cooldown.indexOf({ command: command.name, user: message.author.id }), 1), defaultCooldown);
      }
      command.exec.bind(this)(message, args, () => {
        cooldown.push({ command: command.name, user: message.author.id });
        setTimeout(() => cooldown.splice(cooldown.indexOf({ command: command.name, user: message.author.id }), 1), defaultCooldown);
      });
    } else if (message.guild) {
      await GuildSchema.findByIdAndUpdate(message.guild.id, { $push: { messages: message.createdAt.getTime() } });
    }
  }
};
