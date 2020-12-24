const express = require("express");
const router = express.Router();
const ShortSchema = require("../database/models/Short");

module.exports = () => {
  router.get("/:id", async (request, response) => {
    const short = await ShortSchema.findById(request.params.id);
    console.log("hi");
    if (!short) return response.status(404).redirect("/");
    response.redirect(short.url);
  });
  return router;
};
