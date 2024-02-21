const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

const JWT_SECRET = "secret"; // Clave secreta para firmar los tokens JWT

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Base de datos ficticia de usuarios
const users = [];

// Ruta para registro de usuario
app.post("/register", async (req, res) => {
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Creación del usuario
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    // Agregar usuario a la lista
    users.push(user);
    res.status(200).json({
      resp: "Creado con exito",
    });
  } catch {
    res.status(500).json({
      resp: "Error no creado",
    });
  }
});

// Ruta para inicio de sesión
app.post("/login", async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (user == null) {
    return res.status(400).send("Usuario no encontrado");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      /*     res.status(200).json({
        resp: "Inicio de sesión exitoso",
      }); */
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
      res.status(200).json({ resp: token });
    } else {
      res.status(400).json({
        resp: "Credenciales incorrectas",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      resp: "Error del servidor",
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
