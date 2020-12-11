const UserSchema = require("../../../../database/models/User");

module.exports = {
  name: "rep",
  description: "اضافة نقطة سمعة للشخص",
  aliases: ["like"],
  async exec(message, args) {
    const user = message.mentions.users.first() || (args[1] ? this.users.cache.get(args[1]) || await this.users.fetch(args[1]).catch(() => undefined) : undefined) || message.author;

    if (user === message.author) return message.react("❌").then(() => message.channel.send("لا يمكنك الإعجاب/عدم الإعجاب بنفسك 😠").then(msg => msg.delete({ timeout: 2000 })));
    const profile = await message.author.getProfile();

    if (profile.rep.users.includes(user.id)) return message.react("❌").then(() => message.channel.send("لقد أعطيت رأيك بهذا المستخدم من قبل 🙄").then(msg => msg.delete({ timeout: 2000 })));

    await UserSchema.findByIdAndUpdate(message.author.id, { $push: { "rep.users": user.id } });
    await UserSchema.findByIdAndUpdate(user.id, { $inc: { "rep.likes": 1 } });

    message.react("👍");
  }
};
