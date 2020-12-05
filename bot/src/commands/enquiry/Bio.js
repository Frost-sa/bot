const UserSchema = require("../../../../database/models/User");

module.exports = {
  name: "bio",
  description: "تغيير الوصف الخاص بك في البروفايل.",
  aliases: ["bio", "بايو", "setbio"],
  async exec(message, args) {
    const bio = args.slice(1).join(" ");
    if (!bio) return message.react("❌");
    if (bio.length > 24) {
      message.channel.send("الحد الأقصى للبايو 24 حرف 🙄").then(msg => msg.delete({ timeout: 5000 }));
      return message.react("⚠️");
    }
    await UserSchema.findByIdAndUpdate({ _id: message.author.id }, { $set: { bio } });
    message.react("✅");
  }
};
