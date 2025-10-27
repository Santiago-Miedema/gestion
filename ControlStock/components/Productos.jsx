import React, { useEffect, useState } from "react";
import axios from "axios";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");

  // 🔹 Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // 🔍 Filtrar productos según el texto del buscador
  const productosFiltrados = productos.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Stock de Productos</h2>

      {/* 🔎 Buscador */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "8px",
            width: "60%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 📋 Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Color</th>
            <th>Modelo</th>
            <th>Talle</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Stock Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.marca}</td>
                <td>{p.categoria}</td>
                <td>{p.color}</td>
                <td>{p.modelo}</td>
                <td>{p.talle}</td>
                <td>{p.stock}</td>
                <td>${p.precio}</td>
                <td>{p.stock_minimo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "10px" }}>
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;


