const express = require("express");
const { Links, User } = require("../models");

const router = express.Router();

router.get("/links/:username", (req, res) => {
  const username = req.params.username;
  res.render("layout", {
    title: "Meus links - DevLinks",
    username: username,
    template: "links",
  });
});

router.get("/list-links", async (req, res) => {
  const username = req.query.username;
  if (!username || username === null) {
    return res.send(
      '<p class="text-center">Ops, nenhum link foi encontrado!!</p>'
    );
  }
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.send(
        '<p class="text-center">Ops, nenhum link foi encontrado!!</p>'
      );
    }

    const links = await Links.findAll({ where: { userId: user.id } });

    if (links.length === 0) {
      return res.send(
        '<p class="text-center">Ops, nenhum link foi encontrado!!</p>'
      );
    }

    let html = links
      .map(
        (link) => `
      <a class="bg-white flex items-center justify-center w-full p-2 mt-4 rounded" href="${link.url}" target="blank">
        <p class='text-lg text-black w-full text-center'>${link.name}</p>
      </a>
    `
      )
      .join("");
    return res.send(html);
  } catch (error) {
    res.status(400).send("Erro ao localizar seus links");
  }
});

module.exports = router;
