import React, { useEffect, useState } from "react";
import axios from "axios";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const res = await axios.get("http://localhost:3001/clientes");
    const data = Array.isArray(res.data) ? res.data : [res.data];
    setClientes(data);
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.trim()) return;
    await axios.post("http://localhost:3001/clientes", { nombre: nuevoCliente });
    setNuevoCliente("");
    cargarClientes();
  };

  const eliminarCliente = async (id) => {
    await axios.delete(`http://localhost:3001/clientes/${id}`);
    cargarClientes();
  };

  // 🔍 Filtrar clientes por nombre
  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Clientes</h2>

      {/* 📌 Nuevo cliente y buscador */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <input
        id="BuscadorCliente"
          type="text"
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 📋 Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;

