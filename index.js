const { Client } = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");
const client = new Client();
const app = express();

require("dotenv").config();
require("./bot");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use("/api", require("./routes/Api")(client));
app.use("/sh", require("./routes/Short")());


"Leaderboard Backend";
app.get("/leaderboard.png", async (request, response) => {
  const dir = `${__dirname}/leaderboards/${request.query.coins === "true" ? "coins" : "xp"}`;
  const leaderboards = require("fs").readdirSync(dir);
  const page = leaderboards[request.query.page - 1];
  if (!page) return response.status(404).redirect("/");
  response.sendFile(`${dir}/${page}`);
});
app.use(express.static("web/assest"));
app.get("/", async (request, response) => {
  response.sendFile(`${__dirname}/web/index.html`);
});
app.get("/:GuildID/dashboard", async (request, response) => {
  const { GuildID } = request.params;
  const guild = await client.guilds.fetch(GuildID);
  response.sendFile(`${__dirname}/web/dashboard-3.html`);
});
app.listen(80, () => console.log("Listening on port 80!"));
client.login(process.env.TOKEN);
