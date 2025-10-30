import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/ventasTodo.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("");

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

  const ventasFiltradas = ventas.filter((v) =>
    `${v.cliente_nombre} ${v.cliente_apellido}`.toLowerCase().includes(filtro.toLowerCase())
  );

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
                <tr key={v.id_venta}>
                  <td>{v.id_venta}</td>
                  <td>{v.usuario_nombre}</td>
                  <td>{v.cliente_nombre} {v.cliente_apellido}</td>
                  <td>${v.importeTotal}</td>
                  <td>
                        {v.fecha
                            ? new Date(v.fecha.replace(" ", "T")).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "-"}
                    </td>



                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-ventas">No se encontraron ventas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ventas;
