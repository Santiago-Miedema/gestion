import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientesForm from "./ClientesForm";
import "../stylos/Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [nombreEliminar, setNombreEliminar] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito"); // ✅ para estilo del mensaje

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/clientes");
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setClientes(data);
    } catch (error) {
      mostrarMensajeTemporal("Error al cargar clientes ❌", "error");
    }
  };

  const agregarCliente = async (nuevoCliente) => {
    if (
      !nuevoCliente.nombre.trim() ||
      !nuevoCliente.apellido.trim() ||
      !nuevoCliente.email.trim()
    ) {
      mostrarMensajeTemporal("Complete todos los campos obligatorios ❗", "error");
      return;
    }

    try {
      await axios.post("http://localhost:3001/clientes", nuevoCliente);
      cargarClientes();
      mostrarMensajeTemporal("Cliente agregado exitosamente ✅", "exito");
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      mostrarMensajeTemporal("Error al agregar cliente ❌", "error");
    }
  };

  const eliminarCliente = async (e) => {
    e.preventDefault();
    if (!nombreEliminar.trim()) {
      mostrarMensajeTemporal("Ingrese el nombre del cliente ❗", "error");
      return;
    }

    const cliente = clientes.find(
      (c) => c.nombre.toLowerCase() === nombreEliminar.toLowerCase()
    );

    if (!cliente) {
      mostrarMensajeTemporal("Cliente no encontrado ❌", "error");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/clientes/${cliente.id_cliente}`);
      cargarClientes();
      setNombreEliminar("");
      mostrarMensajeTemporal("Cliente eliminado exitosamente 🗑️", "exito");
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      mostrarMensajeTemporal("Error al eliminar cliente ❌", "error");
    }
  };

  const mostrarMensajeTemporal = (mensaje, tipo = "exito") => {
    setMensajeExito(mensaje);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensajeExito("");
      setMostrarAgregar(false);
      setMostrarEliminar(false);
    }, 2000);
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  const cerrarModales = () => {
    setMostrarAgregar(false);
    setMostrarEliminar(false);
  };

  return (
    <div className="container-clientes">
      {/* ---------- Header con botones ---------- */}
      <div className="clientes-header">
        <h2>Clientes</h2>
        <div className="clientes-buttons">
          <button
            onClick={() => {
              setMostrarAgregar(true);
              setMostrarEliminar(false);
            }}
          >
            ➕ Agregar Cliente
          </button>
          <button
            onClick={() => {
              setMostrarEliminar(true);
              setMostrarAgregar(false);
            }}
          >
            🗑️ Eliminar Cliente
          </button>
        </div>
      </div>

      {/* ---------- Buscador ---------- */}
      <div className="buscador-container">
        <input
          id="BuscadorCliente"
          type="text"
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

      {/* ---------- Tabla ---------- */}
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
              <td colSpan="6" className="no-clientes">
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- Modal Agregar Cliente ---------- */}
      {mostrarAgregar && (
        <div className="overlay" onClick={cerrarModales}>
          <div
            className="form-animado"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="cerrar-form" onClick={cerrarModales}>
              ✖
            </button>
            <ClientesForm agregarCliente={agregarCliente} />
          </div>
        </div>
      )}

      {/* ---------- Modal Eliminar Cliente ---------- */}
      {mostrarEliminar && (
        <div className="overlay" onClick={cerrarModales}>
          <div
            className="form-animado"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="cerrar-form" onClick={cerrarModales}>
              ✖
            </button>
            <form className="clientes-form eliminar-form" onSubmit={eliminarCliente}>
              <h3>Eliminar cliente ❌</h3>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={nombreEliminar}
                onChange={(e) => setNombreEliminar(e.target.value)}
              />
              <button type="submit" className="btn-eliminar">
                Eliminar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Modal de éxito / error ---------- */}
      {mensajeExito && (
        <div className={`modal-exito ${tipoMensaje}`}>
          <p>{mensajeExito}</p>
        </div>
      )}
    </div>
  );
}

export default Clientes;