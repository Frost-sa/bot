module.exports = {
  name: "inviteCreate",
  async exec(invite) {
    let invites = await invite.guild.fetchInvites();
    invite.client.invites[invite.guild.id] = invites;
  }
}