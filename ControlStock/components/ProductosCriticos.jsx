import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/ProductosCriticos.css"; // 👈 Import del CSS

function ProductosCriticos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/productos-criticos");
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

  // Función para determinar la clase CSS según el stock
  const getStockClass = (stock, stockMinimo) => {
    if (stock <= 0) return "stock-rojo";
    if (stock > 0 && stock <= stockMinimo) return "stock-amarillo";
    return "";
  };

  return (
    <div className="dashboard-container">
      <h2>Productos Críticos</h2>

      {/* 🔎 Buscador */}
      <div className="buscador-container">
        <input
          id="buscadorProductosCriticos"
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

            {/* 📋 Tabla con scroll */}
      <div className="tabla-scroll">
        <table className="tabla-clientes tabla-productos">
          <thead>
            <tr>
              
              <th>Modelo</th>
              <th>Marca</th>
              <th>Color</th>
              <th>Talle</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((p) => (
                <tr key={p.id_producto}>
                  
                  <td>{p.modelo}</td>
                  <td>{p.marca}</td>
                  <td>{p.color}</td>
                  <td>{p.talle}</td>
                  <td className={`stock ${getStockClass(p.stock, p.stock_minimo)}`}>
                    {p.stock}
                  </td>
                  <td>${p.precio}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-clientes">
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

export default ProductosCriticos;
