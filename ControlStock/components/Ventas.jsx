import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/ventasTodo.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/ventas");
      setVentas(res.data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
    }
  };

  const cargarDetalles = async (idVenta) => {
    try {
      const res = await axios.get(`http://localhost:3001/ventas/${idVenta}/detalles`);
      setDetalles(res.data);
      setMostrarModal(true);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
    }
  };

  const ventasFiltradas = ventas.filter((v) =>
    `${v.cliente_nombre} ${v.cliente_apellido}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleClickFila = (venta) => {
    setVentaSeleccionada(venta);
    cargarDetalles(venta.id_venta);
  };

  return (
    <div className="ventas-container">
      <h2>Ventas realizadas</h2>

      <div className="buscador-container">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

      <div className="tabla-scroll">
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Vendedor</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length > 0 ? (
              ventasFiltradas.map((v) => (
                <tr key={v.id_venta} onClick={() => handleClickFila(v)} className="fila-clickable">
                  <td>{v.id_venta}</td>
                  <td>{v.usuario_nombre}</td>
                  <td>
                    {v.cliente_nombre} {v.cliente_apellido}
                  </td>
                  <td>${v.importeTotal}</td>
                  <td>
                    <td>{v.fecha?.split(" ")[0] || "-"}</td>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-ventas">
                  No se encontraron ventas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal Detalle === */}
      {mostrarModal && ventaSeleccionada && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle de Venta #{ventaSeleccionada.id_venta}</h3>
            <p>
              Cliente: {ventaSeleccionada.cliente_nombre} {ventaSeleccionada.cliente_apellido}
            </p>
            <p>Total: ${ventaSeleccionada.importeTotal}</p>
            <hr />

            {detalles.length > 0 ? (
              <table className="tabla-detalle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Tiempo Real</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{d.cantidad}</td>
                      <td>${d.precio}</td>
                      <td>{d.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay detalles para esta venta.</p>
            )}

            <button className="btn-cerrar" onClick={() => setMostrarModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;
