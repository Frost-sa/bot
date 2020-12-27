const express = require("express");
const router = express.Router();

module.exports = () => {
  router.get("/leaderboard.png", async (request, response) => {
    response.sendStatus(202);
  });
  return router;
};
