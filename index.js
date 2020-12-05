const { Client } = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");
const client = new Client();
const app = express();

require("dotenv").config();
require("./bot");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use("/api", require("./routes/Api")(client), (request, response) => {
  response.status(404).send({ error: "This endpoint couldn't be found or not available." });
});

app.listen(80, () => console.log("Listening on port 80!"));
client.login(process.env.TOKEN);
