import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/UltimosClientes.css"; // 👈 Usa los mismos estilos

function UltimosClientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarUltimosClientes();
  }, []);

  const cargarUltimosClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/clientes-ultimos");
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener los últimos clientes:", error);
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Últimos Clientes</h2>

      {/* 🔎 Buscador */}
      <div className="buscador-container">
        <input
          id="BuscadorUltimosClientes"
          type="text"
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

      {/* 📋 Tabla */}
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((c) => (
              <tr key={c.id_cliente}>
                <td>{c.id_cliente}</td>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.email}</td>
                <td>{c.direccion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-clientes">
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UltimosClientes;
