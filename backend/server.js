// backend/server.js
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// 🔌 Conexión a MySQL (modo async)
// ==========================
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "Gestion",
    });
    console.log("✅ Conectado a MySQL (modo async)");
  } catch (err) {
    console.error("❌ Error al conectar a MySQL:", err);
  }
})();

// ==========================
// 🧪 Endpoint de prueba
// ==========================
app.get("/usuario", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM materias");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
});

app.post("/login", async (req, res) => {
  const { nombre, clave } = req.body;
  try {
    const [result] = await db.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?",
      [nombre, clave]
    );

    if (result.length > 0) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res.json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// ==========================
// 📦 CLIENTES
// ==========================
app.get("/clientes", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

app.get("/clientes-ultimos", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM clientes ORDER BY id_cliente DESC LIMIT 4"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener últimos clientes" });
  }
});

app.post("/clientes", async (req, res) => {
  const { nombre, apellido, email, direccion } = req.body;
  if (!nombre || !apellido || !email)
    return res.status(400).json({ error: "Campos obligatorios faltantes" });

  try {
    const [result] = await db.query(
      "INSERT INTO clientes (nombre, apellido, email, direccion) VALUES (?, ?, ?, ?)",
      [nombre, apellido, email, direccion || null]
    );
    res.json({ id: result.insertId, nombre, apellido, email, direccion });
  } catch (err) {
    res.status(500).json({ error: "Error al insertar cliente" });
  }
});

app.delete("/clientes/:id_cliente", async (req, res) => {
  try {
    const { id_cliente } = req.params;
    await db.query("DELETE FROM clientes WHERE id_cliente = ?", [id_cliente]);
    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
});

app.put("/clientes/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;
  const { nombre, apellido, email, direccion } = req.body;
  try {
    await db.query(
      "UPDATE clientes SET nombre=?, apellido=?, email=?, direccion=? WHERE id_cliente=?",
      [nombre, apellido, email, direccion, id_cliente]
    );
    res.json({ mensaje: "Cliente actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
});

// ========================
// 📦 PRODUCTOS
// ========================
app.get("/productos", async (req, res) => {
  const sql = `
    SELECT 
      p.id_producto,
      p.id_marca,
      p.id_categoria,
      p.id_color,
      p.id_modelo,
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
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.post("/productos", async (req, res) => {
  const {
    id_marca,
    id_categoria,
    id_color,
    id_modelo,
    talle,
    stock,
    precio,
    stock_minimo,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO productos (id_marca, id_categoria, id_color, id_modelo, talle, stock, precio, stock_minimo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_marca, id_categoria, id_color, id_modelo, talle, stock, precio, stock_minimo]
    );
    res.json({ message: "✅ Producto agregado correctamente" });
  } catch (err) {
    console.error("Error al agregar producto:", err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_marca,
    id_categoria,
    id_color,
    id_modelo,
    talle,
    stock,
    precio,
    stock_minimo,
  } = req.body;

  try {
    await db.query(
      `UPDATE productos SET 
        id_marca=?, id_categoria=?, id_color=?, id_modelo=?, talle=?, stock=?, precio=?, stock_minimo=?
       WHERE id_producto=?`,
      [id_marca, id_categoria, id_color, id_modelo, talle, stock, precio, stock_minimo, id]
    );
    res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    res.json({ message: "🗑️ Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// ========================
// 📋 TABLAS AUXILIARES
// ========================
app.get("/marcas", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM marca");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener marcas" });
  }
});

app.get("/categorias", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categoria");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener categorias" });
  }
});

app.get("/colores", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM color");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener colores" });
  }
});

app.get("/modelos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM modelo");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener modelos" });
  }
});

app.post("/nuevo-valor/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const { nombre } = req.body;

  const tablas = {
    marca: "marca",
    categoria: "categoria",
    color: "color",
    modelo: "modelo",
  };

  const tabla = tablas[tipo];
  if (!tabla) return res.status(400).json({ error: "Tipo inválido" });

  try {
    await db.query(`INSERT INTO ${tabla} (${tabla}) VALUES (?)`, [nombre]);
    res.json({ message: `✅ Nuevo ${tipo} agregado correctamente` });
  } catch (err) {
    console.error("Error al agregar nuevo valor:", err);
    res.status(500).json({ error: "Error al agregar nuevo valor" });
  }
});

// ✅ Productos críticos (stock <= stock_minimo)
app.get("/productos-criticos", async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      ORDER BY p.stock ASC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos críticos:", error);
    res.status(500).json({ error: "Error al obtener productos críticos" });
  }
});

// ==========================
// 🧾 VENTAS
// ==========================
app.post("/venta", async (req, res) => {
  const { id_cliente, id_usuario, importeTotal } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO venta (id_cliente, id_usuario, importeTotal) VALUES (?, ?, ?)",
      [id_cliente, id_usuario, importeTotal]
    );
    res.json({ id_venta: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Error al crear venta" });
  }
});

app.post("/venta-detalle", async (req, res) => {
  const { id_venta, id_producto, cantidad, precio, fecha, tiempo_real } = req.body;
  try {
    await db.query(
      "INSERT INTO venta_detalle (id_venta, id_producto, cantidad, precio, fecha, tiempo_real) VALUES (?, ?, ?, ?, ?, ?)",
      [id_venta, id_producto, cantidad, precio, fecha, tiempo_real]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al crear detalle de venta" });
  }
});

app.put("/actualizar-stock/:id_producto", async (req, res) => {
  const { id_producto } = req.params;
  const { cantidad } = req.body;
  try {
    await db.query("UPDATE productos SET stock = stock - ? WHERE id_producto = ?", [cantidad, id_producto]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar stock" });
  }
});

app.get("/ventas", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.id_venta,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        u.usuario AS usuario_nombre,
        v.importeTotal,
        DATE_FORMAT(MAX(d.fecha), '%Y-%m-%d') AS fecha
      FROM venta v
      JOIN clientes c ON v.id_cliente = c.id_cliente
      JOIN usuarios u ON v.id_usuario = u.id_usuario
      JOIN venta_detalle d ON v.id_venta = d.id_venta
      GROUP BY v.id_venta, c.nombre, c.apellido, u.usuario, v.importeTotal
      ORDER BY v.id_venta DESC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});
app.get("/ventas/:id/detalles", async (req, res) => {
  const { id } = req.params;
  const sql = `
  SELECT 
    vd.cantidad,
    DATE_FORMAT(vd.fecha, '%d/%m/%Y') AS fecha,
    vd.precio,
    CONCAT(m.marca, ' ', mo.modelo, ' ', c.categoria) AS nombre_producto
  FROM venta_detalle vd
  JOIN productos p ON vd.id_producto = p.id_producto
  JOIN marca m ON p.id_marca = m.id_marca
  JOIN modelo mo ON p.id_modelo = mo.id_modelo
  JOIN categoria c ON p.id_categoria = c.id_categoria
  WHERE vd.id_venta = ?;
`;

  try {
    const [result] = await db.query(sql, [id]);
    res.json(result);
  } catch (err) {
    console.error("Error al obtener detalles:", err);
    res.status(500).send("Error al obtener detalles de venta");
  }
});



// ==========================
// 🚀 SERVIDOR
// ==========================
app.listen(3001, () => {
  console.log("🚀 Servidor backend en http://localhost:3001");
});
