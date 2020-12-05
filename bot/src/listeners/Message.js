const GuildSchema = require("../../../database/models/Guild");

const cooldown = [];
module.exports = {
  name: "message",
  async exec(message) {
    if (message.author.bot) return;
    message.prefix = await message.getPrefix();

    const args = message.content.slice(message.prefix.length).split(" ");
    const command = this.commandHandler.find(command => command.name === args[0].toLowerCase() || command.aliases.includes(args[0].toLowerCase()));

    if (command && message.content.startsWith(message.prefix)) {
      let defaultCooldown = command.cooldown || 2000;
      if (cooldown.find(person => person.command === command.name && person.user === message.author.id)) return message.react("🤌").then(() => message.delete({ timeout: 2000 }).catch(() => undefined));
      if (command.turboOnly && !process.env.TURBO) return;
      if (process.env.TURBO && !command.cooldown) defaultCooldown = 0;
      if (command.guildOnly && !message.guild) return message.react("❌");
      cooldown.push({ command: command.name, user: message.author.id });
      setTimeout(() => cooldown.splice(cooldown.indexOf({ command: command.name, user: message.author.id }), 1), defaultCooldown);
      if (message.guild) {
        if (command.memberPermissions && !message.member.hasPermission(command.memberPermissions)) return;
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("** ليس لدي الصلاحيات الكافية 🙄 **").catch(console.log);
      }
      command.exec.bind(this)(message, args);
    } else if (message.guild) {
      GuildSchema.findByIdAndUpdate(message.guild.id, { $inc: { messages: 1 } });
    }
  }
};
