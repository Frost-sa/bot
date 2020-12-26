module.exports = {
  name: "messageUpdate",
  async exec(oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) return false;
    newMessage.fromEdit = true;
    if (oldMessage.launched || Date.now () - oldMessage.createdTimestamp > 60000) return false;
    newMessage.client.emit("message", newMessage);
  }
};
