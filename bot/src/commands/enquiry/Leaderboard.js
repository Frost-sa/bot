module.exports = {
  name: "leaderboard",
  async exec(message) {
    let counter = 0;
    let coins = true;
    const reactions = { previous: "⏮️", next: "⏭️", level: "🏅", coins: "💰" };
    const getContent = () => `http://20.55.99.164/leaderboard.png?coins=${coins}&page=${counter + 1}&v=${Date.now() - this.lastLeaderUpdate > 60000 ? Date.now() : this.lastLeaderUpdate}`;
    if (Date.now() - this.lastLeaderUpdate > 60000) {
      message.channel.startTyping();
      await this.updateLeaderBoard();
    }
    const theMessage = await message.channel.send(getContent());
    message.channel.stopTyping();
    for (const Reaction of Object.values(reactions).slice(0, -1)) {
      await theMessage.react(Reaction);
    }
    const reactionCollector = await theMessage.createReactionCollector((reaction, user) => user.id === message.author.id);
    reactionCollector.on("collect", async reaction => {
      await reaction.users.remove(message.author);
      switch (reaction.emoji.name) {
      case reactions.previous:
        counter--;
        reaction.stateChanged = true;
        break;
      case reactions.next:
        counter++;
        reaction.stateChanged = true;
        break;
      case reactions.coins:
        if (coins === false) {
          reaction.stateChanged = true;
          reaction.users.remove();
          theMessage.react(reactions.level);
        }
        coins = true;
        break;
      case reactions.level:
        if (coins === true) {
          reaction.stateChanged = true;
          reaction.users.remove();
          theMessage.react(reactions.coins);
        }
        coins = false;
        break;
      }
      if (counter > 2) counter = 0;
      if (counter < 0) counter = 2;
      theMessage.edit(getContent());
    });
  }
};