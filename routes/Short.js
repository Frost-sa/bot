const express = require("express");
const router = express.Router();
module.exports = () => {
  router.get("/:id", async (request, response) => {
    const url = "https://cdn.discordapp.com/emojis/783496313320898570.gif?v=1";
    if (!url) return response.sendStatus(404).redirect("/");
    response.redirect(url);
  });
  return router;
};
