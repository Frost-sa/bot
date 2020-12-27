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
const leaderboards = require("fs").readdirSync(__dirname + "/leaderboards");
app.get("/leaderboard.png", async (request, response) => {
    const page = leaderboards[request.query.page];
    if (!page) return response.status(404).redirect("/");
    response.sendFile(__dirname + "/leaderboards/" + page);
});
app.listen(80, () => console.log("Listening on port 80!"));
client.login(process.env.TOKEN);