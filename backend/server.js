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
    console.error("Error al conectar a 3:", err);
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

// ✅ Crear cliente
app.post("/clientes", (req, res) => {
  const { nombre, apellido, email, direccion } = req.body;

  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: "Campos obligatorios faltantes" });
  }

  const q = "INSERT INTO clientes (nombre, apellido, email, direccion) VALUES (?, ?, ?, ?)";
  db.query(q, [nombre, apellido, email, direccion || null], (err, data) => {
    if (err) {
      console.error("Error al insertar cliente:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    return res.json({ id: data.insertId, nombre, apellido, email, direccion });
  });
});

// Eliminar cliente
app.delete("/clientes/:id_cliente", (req, res) => {
  const { id_cliente } = req.params;
  const q = "DELETE FROM clientes WHERE id_cliente = ?";
  db.query(q, [id_cliente], (err, data) => {
    if (err) {
      console.error("Error al eliminar cliente:", err);
      return res.status(500).json({ error: "Error al eliminar cliente" });
    }
    return res.json({ mensaje: "Cliente eliminado correctamente" });
  });
});
// 🟡 Editar cliente
app.put("/clientes/:id_cliente", (req, res) => {
  const { id_cliente } = req.params;
  const { nombre, apellido, email, direccion } = req.body;

  const q = `
    UPDATE clientes 
    SET nombre = ?, apellido = ?, email = ?, direccion = ?
    WHERE id_cliente = ?`;

  db.query(q, [nombre, apellido, email, direccion, id_cliente], (err, data) => {
    if (err) {
      console.error("Error al actualizar cliente:", err);
      return res.status(500).json({ error: "Error al actualizar cliente" });
    }
    return res.json({ mensaje: "Cliente actualizado correctamente" });
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


// Crear venta
app.post("/venta", (req, res) => {
  const { id_cliente, id_usuario, importeTotal } = req.body;
  const q = "INSERT INTO venta (id_cliente, id_usuario, importeTotal) VALUES (?, ?, ?)";
  db.query(q, [id_cliente, id_usuario, importeTotal], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear venta" });
    res.json({ id_venta: result.insertId });
  });
});


// Crear detalle de venta
app.post("/venta-detalle", (req, res) => {
  const { id_venta, id_producto, cantidad, precio, fecha, tiempo_real } = req.body;
  const q = `
    INSERT INTO venta_detalle (id_venta, id_producto, cantidad, precio, fecha, tiempo_real)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(q, [id_venta, id_producto, cantidad, precio, fecha, tiempo_real], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear detalle de venta" });
    res.json({ success: true });
  });
});

// Actualizar stock del producto
app.put("/actualizar-stock/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const { cantidad } = req.body;

  // Restar la cantidad vendida
  const q = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
  db.query(q, [cantidad, id_producto], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar stock" });
    res.json({ success: true });
  });
});
// 🧾 Obtener todas las ventas con nombre del cliente y usuario
app.get("/ventas", (req, res) => {
  const q = `
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
  `;

  db.query(q, (err, rows) => {
    if (err) {
      console.error("Error al obtener ventas:", err);
      res.status(500).json({ error: "Error al obtener ventas" });
    } else {
      res.json(rows);
    }
  });
});

// ============================
// 📋 Listas de apoyo para el formulario
// ============================

// Obtener todas las marcas
app.get("/marcas", (req, res) => {
  const q = "SELECT * FROM marca ORDER BY marca";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Error al obtener marcas" });
    res.json(data);
  });
});

// Obtener todas las categorías
app.get("/categorias", (req, res) => {
  const q = "SELECT * FROM categoria ORDER BY categoria";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Error al obtener categorías" });
    res.json(data);
  });
});

// Obtener todos los modelos
app.get("/modelos", (req, res) => {
  const q = "SELECT * FROM modelo ORDER BY modelo";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Error al obtener modelos" });
    res.json(data);
  });
});

// Obtener todos los colores
app.get("/colores", (req, res) => {
  const q = "SELECT * FROM color ORDER BY color";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Error al obtener colores" });
    res.json(data);
  });
});

// ============================
// 🔍 Verificar o crear registros base
// ============================

// Marca
app.post("/marcas", (req, res) => {
  const { nombre } = req.body;
  const qCheck = "SELECT id_marca FROM marca WHERE marca = ?";
  db.query(qCheck, [nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) return res.json({ id: result[0].id_marca });

    const qInsert = "INSERT INTO marca (marca) VALUES (?)";
    db.query(qInsert, [nombre], (err2, data) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ id: data.insertId });
    });
  });
});

// Categoría
app.post("/categorias", (req, res) => {
  const { nombre } = req.body;
  const qCheck = "SELECT id_categoria FROM categoria WHERE categoria = ?";
  db.query(qCheck, [nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) return res.json({ id: result[0].id_categoria });

    const qInsert = "INSERT INTO categoria (categoria) VALUES (?)";
    db.query(qInsert, [nombre], (err2, data) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ id: data.insertId });
    });
  });
});

// Modelo
app.post("/modelos", (req, res) => {
  const { nombre } = req.body;
  const qCheck = "SELECT id_modelo FROM modelo WHERE modelo = ?";
  db.query(qCheck, [nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) return res.json({ id: result[0].id_modelo });

    const qInsert = "INSERT INTO modelo (modelo) VALUES (?)";
    db.query(qInsert, [nombre], (err2, data) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ id: data.insertId });
    });
  });
});

// Color
app.post("/colores", (req, res) => {
  const { nombre } = req.body;
  const qCheck = "SELECT id_color FROM color WHERE color = ?";
  db.query(qCheck, [nombre], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) return res.json({ id: result[0].id_color });

    const qInsert = "INSERT INTO color (color) VALUES (?)";
    db.query(qInsert, [nombre], (err2, data) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ id: data.insertId });
    });
  });
});

// ============================
// ➕ Crear un nuevo producto
// ============================
app.post("/productos", (req, res) => {
  const { id_marca, id_categoria, id_modelo, id_color, talle, stock, precio, stock_minimo } = req.body;

  const q = `
    INSERT INTO productos (id_marca, id_categoria, id_modelo, id_color, talle, stock, precio, stock_minimo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(q, [id_marca, id_categoria, id_modelo, id_color, talle, stock, precio, stock_minimo], (err, data) => {
    if (err) return res.status(500).json({ error: "Error al crear producto" });
    res.json({ message: "Producto agregado correctamente", id_producto: data.insertId });
  });
});

// ============================
// ❌ Eliminar producto
// ============================
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM productos WHERE id_producto = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Error al eliminar producto" });
    res.json({ message: "Producto eliminado correctamente" });
  });
});

// 🟢 Agregar un nuevo producto (versión corregida)
app.post("/productos/agregar", (req, res) => {
  const { marca, categoria, color, modelo, talle, stock, precio, stock_minimo } = req.body;

  if (!marca || !categoria || !color || !modelo || !talle || !stock || !precio) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // 🔹 Función auxiliar para obtener o crear registros relacionados
  const getOrCreate = (tabla, columna, valor) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT id_${tabla} FROM ${tabla} WHERE ${columna} = ?`, [valor], (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) return resolve(result[0][`id_${tabla}`]);
        db.query(`INSERT INTO ${tabla} (${columna}) VALUES (?)`, [valor], (err2, insert) => {
          if (err2) return reject(err2);
          resolve(insert.insertId);
        });
      });
    });
  };

  // 🔹 Paso 1: obtener o crear IDs relacionados
  Promise.all([
    getOrCreate("marca", "marca", marca),
    getOrCreate("categoria", "categoria", categoria),
    getOrCreate("modelo", "modelo", modelo),
    getOrCreate("color", "color", color)
  ])
    .then(([id_marca, id_categoria, id_modelo, id_color]) => {
      // 🔹 Paso 2: insertar el producto
      const q = `
        INSERT INTO productos (id_marca, id_categoria, id_modelo, id_color, talle, stock, precio, stock_minimo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(q, [id_marca, id_categoria, id_modelo, id_color, talle, stock, precio, stock_minimo || 0], (err, result) => {
        if (err) {
          console.error("Error al insertar producto:", err);
          return res.status(500).json({ error: "Error al guardar producto" });
        }
        console.log("✅ Producto agregado:", result.insertId);
        res.json({ success: true, id_producto: result.insertId });
      });
    })
    .catch(err => {
      console.error("Error en inserción de datos relacionados:", err);
      res.status(500).json({ error: "Error al procesar producto" });
    });
});

// 🔐 Verificar contraseña de usuario (para confirmación de eliminación)
app.post("/verificar-clave", (req, res) => {
  const { clave } = req.body;

  if (!clave) {
    return res.status(400).json({ success: false, message: "Falta la clave" });
  }

  const q = "SELECT * FROM usuarios WHERE clave = ?";
  db.query(q, [clave], (err, result) => {
    if (err) {
      console.error("Error al verificar clave:", err);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }

    if (result.length > 0) {
      return res.json({ success: true, message: "Clave válida" });
    } else {
      return res.json({ success: false, message: "Clave incorrecta" });
    }
  });
});



app.listen(3001, () => {
  console.log("Servidor backend en http://localhost:3001");
});
