const Embed = require("../../structure/Embed");
module.exports = {
  name: "ping",
  aliases: ["استجابة", "ping-test"],
  guildOnly: false,
  async exec(message, args) {
    const beforeSend = Date.now();
    const theMessage = await message.channel.send("Ping");
    const afterSend = Date.now();
    await theMessage.edit("Pong");
    const afterEdit = Date.now();
    await theMessage.delete();
    const afterDelete = Date.now();
    const pingEmbed = new Embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle("Ping Test Results")
      .setDescription(`**Pinging Results | :leaves:\n\`\`\`fix\nSend Ping Result: ${afterSend - beforeSend}\nEdit Ping Result: ${afterEdit - afterSend}\nDelete Ping Result: ${afterDelete - afterEdit}\`\`\`**`)
    message.channel.send(pingEmbed);
  }
};
