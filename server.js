const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authentication");
const dashboardRoutes = require("./routes/dashboard");
const publicRoutes = require("./routes/public");

const app = express();
const port = 3333;

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(publicRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);

app.get("/", (req, res) => {
  res.render("layout", { title: "Dev Links - Meus Links", template: "index" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
