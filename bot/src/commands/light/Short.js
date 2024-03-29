const crypto = require("crypto");
const ShortSchema = require("../../../../database/models/Short");

module.exports = {
  name: "short",
  description: "",
  aliases: ["اختصار"],
  guildOnly: false,
  async exec(message, args) {
    const url = args[1];
    if (!url || !url.startsWith("https://")) return message.react("❌");
    const _id = crypto.randomBytes(3).toString("base64");
    const short = new ShortSchema({ url, _id });

    await short.save();
    message.channel.send(`https://frostapp.net/${_id}`);
  }
};
