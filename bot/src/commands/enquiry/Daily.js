const UserSchema = require("../../../../database/models/User");

module.exports = {
  name: "daily",
  async exec(message) {
    const userData = await UserSchema.findById(message.author.id);
    if (Date.now() - userData.daily > 24 * 60 * 60 * 1000) return message.react("⏱️");
    const coins = Math.round(Math.random() * 300);
    await UserSchema.findByIdAndUpdate(message.author.id, { $set: { daily: 50 }, $inc: { coins } });
    for (const number of String(coins).split("")) {
      await message.react(["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"][Number(number)]);
    }
    await message.react("💰");
  }
};
