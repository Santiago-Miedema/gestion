import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/Productos.css"; // Import del CSS

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");

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

  const productosFiltrados = productos.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="productos-container">
      <h2>Stock de Productos</h2>

      {/* 🔎 Buscador */}
      <div className="buscador-container">
        <input
          id="BuscadorProductos"
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

      {/* 📋 Tabla */}
      <div className="tabla-scroll">
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoría</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Color</th>
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
                <td>{p.categoria}</td>
                <td>{p.modelo}</td>
                <td>{p.marca}</td>
                <td>{p.color}</td>
                <td>{p.talle}</td>
                <td>{p.stock}</td>
                <td>${p.precio}</td>
                <td>{p.stock_minimo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-productos">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Productos;



