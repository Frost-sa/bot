const express = require("express");
const axios = require("axios").default;
const randtoken = require("rand-token");
const router = express.Router();
const users = {};
const send = (response, status, message) => response.status(status).send(message);
const checkAuthorization = (request, response, next) => users[request.headers.authorization] ? next() : send(response, 401, { error: "Unauthorized." });
axios.defaults.baseURL = "https://discord.com/api/v8/";
class AsyncArray {
  constructor(arr) {
    this.data = arr;
  }

  filterAsync(predicate) {
    const data = Array.from(this.data);
    return Promise.all(data.map((element, index) => predicate(element, index, data)))
      .then(result => data.filter((element, index) => result[index]));
  }
}

module.exports = client => {
  router.get("/user", checkAuthorization, async (request, response) => {
    client.users.fetch(users[request.headers.authorization].id).then(user => {
      send(response, 200, {
        username: user.username,
        id: user.id,
        avatar: user.displayAvatarURL({ format: "png", size: 2048, dynamic: true }),
        flags: users[request.headers.authorization].flags
      });
    }).catch(() => send(response, 401, { error: "Unauthorized." }));
  });

  router.get("/user/guilds", checkAuthorization, async (request, response) => {
    const filteredGuilds = await new AsyncArray(client.guilds.cache.array()).filterAsync(async guild => {
      const member = guild.members.cache.get(users[request.headers.authorization].id) || await guild.members.fetch(users[request.headers.authorization].id).catch(() => undefined);
      return member && member.hasPermission("MANAGE_GUILD");
    });
    const guilds = filteredGuilds.map(guild => ({
      name: guild.name,
      id: guild.id,
      permissions: guild.member(users[request.headers.authorization].id).permissions.toArray(),
      iconURL: guild.iconURL({ format: "png", dynamic: true, size: 2048 })
    }));
    send(response, 200, guilds);
  });

  router.post("/logout", checkAuthorization, async (request, response) => {
    delete users[request.headers.authorization];
    send(response, 200, { status: "okie!" });
  });

  router.get("/auth", async (request, response) => {
    const { code } = request.query;
    if (!code) return send(response, 422, { error: "No code in query." });

    const params = new URLSearchParams();
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("redirect_uri", "http://20.55.99.164/api/auth");
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("scope", "identify+guilds+guilds.join");
    const tokenResponse = await axios.post("/oauth2/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(error => error.response);
    if (!tokenResponse.data.access_token) return send(response, 401, { error: "Unauthorized." });
    const userResponse = await axios.get("/users/@me", {
      headers: {
        Authorization: `${tokenResponse.data.token_type} ${tokenResponse.data.access_token}`
      }
    }).catch(error => error.response);
    if (!userResponse.data.id) return send(response, 401, { error: "Unauthorized." });
    let userToken = `${randtoken.generate(16)}${Date.now()}`;
    const oldData = Object.values(users).find(user => user.id === userResponse.data.id);
    if (oldData) userToken = Object.keys(users).find(token => users[token] === oldData);
    users[userToken] = {
      id: userResponse.data.id,
      flags: userResponse.data.flags,
      premiumType: userResponse.data.premium_type
    };
    send(response, 200, { token: userToken });
  });

  return router;
};
