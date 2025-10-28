const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // tu usuario de MySQL
  password: "",          // tu contraseña si tiene
  database: "Gestion",   // nombre de tu base
});

// Conexión
db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL ✅");
});

// Endpoint de prueba
app.get("/usuario", (req, res) => {
  db.query("SELECT * FROM materias", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener");
    } else {
      res.json(results);
    }
  });
});

app.post("/login", (req, res) => {
  const { nombre, clave } = req.body;

  const sql = "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?";
  db.query(sql, [nombre, clave], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error en el servidor");
    } else if (result.length > 0) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res.json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  });
});
// 📦 Rutas: CLIENTES
// ============================

// Obtener todos los clientes
 app.get("/clientes", (req, res) => {
   const q = "SELECT * FROM clientes";
   db.query(q, (err, data) => {
     if (err) return res.json(err);
     return res.json(data);
   });
 });

 // 🟢 Obtener los últimos 4 clientes
app.get("/clientes-ultimos", (req, res) => {
  const q = "SELECT * FROM clientes ORDER BY id_cliente DESC LIMIT 4";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// // Agregar cliente
// app.post("/clientes", (req, res) => {
//   const { nombre } = req.body;
//   const q = "INSERT INTO clientes (nombre) VALUES (?)";
//   db.query(q, [nombre], (err, data) => {
//     if (err) return res.json(err);
//     return res.json({ id: data.insertId, nombre });
//   });
// });

// Eliminar cliente
 app.delete("/clientes/:id_cliente", (req, res) => {
   const { id } = req.params;
   const q = "DELETE FROM clientes WHERE id_cliente = ?";
   db.query(q, [id_cliente], (err, data) => {
     if (err) return res.json(err);
     return res.json("Cliente eliminado");
   });
 });

// ============================
// 🛒 Rutas: PRODUCTOS
// ============================

 // ============================
// 🛒 Rutas: PRODUCTOS
// ============================

// 🟢 Obtener todos los productos
app.get("/productos", (req, res) => {
  const q = `
    SELECT 
      p.id_producto,
      m.marca,
      c.categoria,
      col.color,
      mo.modelo,
      p.talle,
      p.stock,
      p.precio,
      p.stock_minimo
    FROM productos p
    JOIN marca m ON p.id_marca = m.id_marca
    JOIN categoria c ON p.id_categoria = c.id_categoria
    JOIN color col ON p.id_color = col.id_color
    JOIN modelo mo ON p.id_modelo = mo.id_modelo
    ORDER BY m.marca, mo.modelo;
  `;

  db.query(q, (err, rows) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      res.status(500).json({ error: "Error al obtener productos" });
    } else {
      res.json(rows);
    }
  });
});

// 🔴 Obtener productos con stock crítico o por debajo del mínimo
app.get("/productos-criticos", (req, res) => {
  const q = `
    SELECT 
      p.id_producto,
      m.marca,
      c.categoria,
      col.color,
      mo.modelo,
      p.talle,
      p.stock,
      p.precio,
      p.stock_minimo
    FROM productos p
    JOIN marca m ON p.id_marca = m.id_marca
    JOIN categoria c ON p.id_categoria = c.id_categoria
    JOIN color col ON p.id_color = col.id_color
    JOIN modelo mo ON p.id_modelo = mo.id_modelo
    WHERE p.stock <= p.stock_minimo
    ORDER BY p.stock, m.marca, mo.modelo;
  `;

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// app.post("/productos", (req, res) => {
//   const { materia } = req.body;
//   const q = "INSERT INTO productos (materia) VALUES (?)";
//   db.query(q, [materia], (err, data) => {
//     if (err) return res.json(err);
//     return res.json({ id: data.insertId, materia });
//   });
// });

//   app.delete("/materias/:id", (req, res) => {
//   const { id } = req.params;
//   const q = "DELETE FROM materias WHERE id = ?";
//   db.query(q, [id], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("materia eliminada");
//   });
// });


app.listen(3001, () => {
  console.log("Servidor backend en http://localhost:3001");
});
