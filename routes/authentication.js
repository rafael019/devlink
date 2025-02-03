const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { template } = require("ejs");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("layout", {
    title: "Login - DevLinks",
    template: "login",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send(400).send("Preencha todos os campos");
  }

  try {
    const user = await User.findOne({ where: { email } });

    // Verifica usuário se está correto
    if (!user) {
      return res.status(401).send("Senha / Usuário incorretos");
    }

    //Verifica senha do usuário se está correta
    const passwordTest = await bcrypt.compare(password, user.password);
    if (!passwordTest) {
      return res.status(401).send("Senha / Usuário incorretos");
    }

    // Gerar e assinar um novo token
    const payload = { id: user.id, username: user.name };
    const token = jwt.sign(payload, "102030", { expiresIn: "30d" });

    req.userId = user.id;
    // Criar um cookie
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    res.cookie("auth_token", token, { expires: expirationDate });
    // Redireciona para a rota dashboard
    res.setHeader("HX-Redirect", "/dashboard");
    return res.send("Usuário cadastrado");
  } catch (error) {
    console.log(err);
    return res.status(401).send("Erro ao efetuar login");
  }
});

router.get("/register", (req, res) => {
  res.render("layout", {
    title: "Página novo usuário - DevLinks",
    template: "register",
  });
});

router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.send(400).send("Preencha todos os campos");
  }
  const newUsername = username.trim();
  const findUser = await User.findOne({ where: { username: newUsername } }); // Verifica no banco se o username já existe

  if (findUser) {
    return res.send(400).send("Esse username já existe");
  }

  const passswordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      username: newUsername,
      email,
      password: passswordHash,
    });
    // Assinar token JWT
    const payload = { id: user.id, username: user.name };
    const token = jwt.sign(payload, "102030", { expiresIn: "30d" });

    console.log(token);

    req.userId = user.id;

    // Criar um cookie
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    res.cookie("auth_token", token, { expires: expirationDate });

    res.setHeader("HX-Redirect", "/dashboard");

    res.send("Usuário criado com sucesso");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Erro ao registrar usuário!");
  }
});

router.get("/logout", (req, res) => {
  res.setHeader("Set-Cookie", "auth_token=; Path=/; Expires=0");
  res.setHeader("HX-Redirect", "/");
  res.send("Ok");
});

module.exports = router;
