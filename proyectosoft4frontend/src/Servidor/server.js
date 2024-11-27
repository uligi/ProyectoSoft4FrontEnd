const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "DB_GP",
});

// Ruta para obtener subtareas
app.get("/subtareas", (req, res) => {
  db.query("SELECT * FROM Subtareas", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Ruta para obtener proyectos y portafolios
app.get("/proyectos", (req, res) => {
  const query = `
        SELECT Proyectos.*, Portafolio.NombrePortafolio 
        FROM Proyectos 
        JOIN Portafolio ON Proyectos.Portafolio_idPortafolio = Portafolio.idPortafolio
    `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
