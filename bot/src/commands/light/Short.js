module.exports = {
  name: "short",
  description: "",
  aliases: ["اختصار"],
  async exec(message, args) {
    const url = args[1];
    if (!url || !url.startsWith("https://")) return message.react("❌");
  }
};
