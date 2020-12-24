const MemberSchema = require("../../../../database/models/Member");
const Embed = require("../../structure/Embed");

module.exports = {
  name: "top",
  aliases: ["توب"],
  async exec(message, args) {
    let membersData = (await MemberSchema.find({})).filter(Member => Member.id.endsWith(`-${message.guild.id}`));
    let currentPage = 0;
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.id == args[1] || role.name.includes(args[1]));
    if (args[1] && !role) return message.react("❌");
    if (role) membersData = membersData.filter(member => role.members.find(m => m.user.id == member.id.split("-")[0]));
    let totalText = 0;
    membersData.forEach(member => totalText += member.textPoints);
    let totalVoice = 0;
    membersData.forEach(member => totalVoice += member.voiceTime.total);
    let totalVipVoice = 0;
    membersData.forEach(member => totalVipVoice += member.voiceTime.vip);
    let totalInvites = 0;
    membersData.forEach(member => totalInvites += member.invites);
    const avgText = totalText / membersData.length;
    const avgVoice = ((totalVoice + totalVipVoice) / 2) / membersData.length;
    const avgInvites = totalInvites / membersData.length;
    function getEmbed () {
      const topEmbed = new Embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .addField(`الأعضاء المتصدرين في ${role ? role.name : "السيرفر"}`, `**${membersData.sort((a, b) => getPerc(b) - getPerc(a)).slice(currentPage * 10, currentPage * 10 + 10).map((member, index) => `${currentPage * 10 + index + 1}. <@${member.id.split("-")[0]}> | \`\`${getPerc(member) == 0 ? 0 : (getPerc(member)).toFixed(1)}%\`\` ${currentPage == 0 ? { 0: "🥇", 1: "🥈", 2: "🥉"}[index] || "" : ""} `).join("\n")}**`)
      .setFooter("الصفحة " + (currentPage + 1) + "/" + (1 + Math.floor(membersData.length / 10)))
      return topEmbed;
    }
    const theMessage = await message.channel.send (getEmbed());
    if (Math.round(membersData.length / 10) > 1) {
      await theMessage.react("⏮️");
      await theMessage.react("⏭️");
      var ReactionsCollector = await theMessage.createReactionCollector((reaction, user) => ["⏮️", "⏭️"].includes(reaction.emoji.name) && user.id == message.author.id, { time: 60000, errors: ["time"]});
      ReactionsCollector.on("collect", async reaction => {
        await reaction.users.remove(message.author);
        switch (reaction.emoji.name) {
          case "⏭️":
            if (currentPage + 1 == Math.round(membersData.length / 10)) return false;
            currentPage ++;
            break;
          case "⏮️":
            if (currentPage == 0) return false;
            currentPage --;
            break;
        }
        theMessage.edit(getEmbed())
      });
    }
    function getPerc (member) {
      const perc = avgInvites != 0 ? (member.invites / avgInvites * 100) : 0 + avgText != 0 ? (member.textPoints / avgText * 100) : 0 + avgVoice != 0 ? (((member.voiceTime.total + member.voiceTime.vip) / 2) / avgVoice * 100) : 0 / 3;
      return isNaN(perc) ? 0 : perc;
    }
  }
}