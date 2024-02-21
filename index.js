const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 5000;
const { executeDB } = require("./db");
const JWT_SECRET = "secret";

const cors = require("cors");

/* parte cors */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const findUser = await executeDB("SELECT * FROM users WHERE email = ?", [
      req.body.email,
    ]);

    if (findUser[0]) {
      res.status(400).json({
        resp: "Usuario ya existe",
      });
      return;
    }
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    const registerUser = executeDB("INSERT INTO users SET ?", user);

    if (registerUser) {
      console.log("Usuario registrado con éxito en la base de datos");
      res.status(200).json({
        resp: "Creado con exito",
      });
    }
  } catch (error) {
    console.error(err);
    res.status(500).send("Error al registrar usuario en la base de datos");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const loginUser = await executeDB("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (loginUser.length === 0) {
      res.status(401).send("Credenciales incorrectas");
    }

    const user = loginUser[0];

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({
        resp: "Credenciales incorrectas",
      });
    }
  } catch (error) {
    console.error(err);
    res.status(500).send("Error al buscar usuario en la base de datos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
