import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBalanceScale } from "react-icons/fa";
import { PiPlusBold  } from "react-icons/pi";
import "../stylos/Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [accion, setAccion] = useState(""); // "sumar" o "ajustar"
  const [valorInput, setValorInput] = useState("");

  // 🔄 Carga inicial de productos
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

  // 🔍 Filtrado dinámico
  const productosFiltrados = productos.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  // 📦 Función que abre el pequeño cuadro de acción
  const abrirVentana = (producto, tipoAccion) => {
    setProductoSeleccionado(producto);
    setAccion(tipoAccion); // "sumar" o "ajustar"
    setValorInput("");
  };

  // 🚀 Ejecuta la acción de update (sumar o ajustar stock)
  const confirmarAccion = async () => {
    if (!valorInput || isNaN(valorInput)) {
      alert("Ingrese un número válido");
      return;
    }

    try {
      if (accion === "sumar") {
        await axios.put(
          `http://localhost:3001/productos/${productoSeleccionado.id_producto}/sumar-stock`,
          { cantidad: parseInt(valorInput) }
        );
      } else if (accion === "ajustar") {
        await axios.put(
          `http://localhost:3001/productos/${productoSeleccionado.id_producto}/ajustar-stock`,
          { nuevoStock: parseInt(valorInput) }
        );
      }

      await cargarProductos(); // recarga la tabla
      cerrarVentana();
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      alert("Error al actualizar stock");
    }
  };

  // ❌ Cierra la ventana flotante
  const cerrarVentana = () => {
    setProductoSeleccionado(null);
    setAccion("");
    setValorInput("");
  };

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
              <th>Gestionar Stock</th> {/* 👈 nueva columna */}
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
                  <td>
                    <button
                      className="btn-sumar"
                      onClick={() => abrirVentana(p, "sumar")}
                    >
                      <PiPlusBold />
                    </button>
                    <button
                      className="btn-ajustar"
                      onClick={() => abrirVentana(p, "ajustar")}
                    >
                      <FaBalanceScale />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-productos">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💬 Ventana emergente */}
      {productoSeleccionado && (
        <div className="overlay">
          <div className="ventana-stock">
            <h3>
              {accion === "sumar"
                ? `Sumar stock a "${productoSeleccionado.modelo}"`
                : `Ajustar stock de "${productoSeleccionado.modelo}"`}
            </h3>
            <input
              type="number"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              placeholder="Ingrese cantidad"
              className="input-stock"
            />
            <div className="acciones">
              <button className="btn-confirmar" onClick={confirmarAccion}>
                Confirmar
              </button>
              <button className="btn-cancelar" onClick={cerrarVentana}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
