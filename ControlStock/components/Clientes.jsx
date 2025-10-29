import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientesForm from "./ClientesForm";
import "../stylos/Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
  });
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/clientes");
      setClientes(res.data);
    } catch (error) {
      mostrarMensaje("Error al cargar clientes ❌", "error");
    }
  };

  const mostrarMensaje = (msg, tipo = "exito") => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 2000);
  };

  const confirmarEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que querés eliminar a ${nombre}?`);
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3001/clientes/${id}`);
      mostrarMensaje("Cliente eliminado ✅", "exito");
      cargarClientes();
    } catch (error) {
      mostrarMensaje("Error al eliminar cliente ❌", "error");
    }
  };

  const abrirEdicion = (cliente) => {
    setClienteEditando(cliente.id_cliente);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      direccion: cliente.direccion || "",
    });
  };

  const cancelarEdicion = () => {
    setClienteEditando(null);
    setFormData({ nombre: "", apellido: "", email: "", direccion: "" });
  };

  const guardarEdicion = async (id) => {
    try {
      await axios.put(`http://localhost:3001/clientes/${id}`, formData);
      mostrarMensaje("Cliente actualizado ✅", "exito");
      cancelarEdicion();
      cargarClientes();
    } catch (error) {
      mostrarMensaje("Error al actualizar cliente ❌", "error");
    }
  };

  const agregarCliente = async (nuevoCliente) => {
    if (!nuevoCliente.nombre.trim() || !nuevoCliente.apellido.trim() || !nuevoCliente.email.trim()) {
      mostrarMensaje("Complete todos los campos obligatorios ❗", "error");
      return;
    }

    try {
      await axios.post("http://localhost:3001/clientes", nuevoCliente);
      mostrarMensaje("Cliente agregado ✅", "exito");
      setMostrarAgregar(false);
      cargarClientes();
    } catch (error) {
      mostrarMensaje("Error al agregar cliente ❌", "error");
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  const cerrarModalAgregar = () => setMostrarAgregar(false);

  return (
    <div className="container-clientes">
      <h2>Clientes</h2>

      {/* Botón agregar cliente */}
      <div className="acciones-superiores">
        <button className="btn-agregar" onClick={() => setMostrarAgregar(true)}>
          ➕ Agregar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="buscador-container">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
      </div>

      {/* Tabla */}
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((c) => (
              <tr key={c.id_cliente}>
                <td>{c.id_cliente}</td>
                <td>
                  {clienteEditando === c.id_cliente ? (
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    c.nombre
                  )}
                </td>
                <td>
                  {clienteEditando === c.id_cliente ? (
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) =>
                        setFormData({ ...formData, apellido: e.target.value })
                      }
                    />
                  ) : (
                    c.apellido
                  )}
                </td>
                <td>
                  {clienteEditando === c.id_cliente ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    c.email
                  )}
                </td>
                <td>
                  {clienteEditando === c.id_cliente ? (
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) =>
                        setFormData({ ...formData, direccion: e.target.value })
                      }
                    />
                  ) : (
                    c.direccion
                  )}
                </td>
                <td className="acciones">
                  {clienteEditando === c.id_cliente ? (
                    <>
                      <button
                        className="btn-guardar"
                        onClick={() => guardarEdicion(c.id_cliente)}
                      >
                        💾 Guardar
                      </button>
                      <button className="btn-cancelar" onClick={cancelarEdicion}>
                        ✖ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-editar"
                        onClick={() => abrirEdicion(c)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() =>
                          confirmarEliminar(c.id_cliente, c.nombre)
                        }
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </td>
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

      {/* Modal Agregar Cliente */}
      {mostrarAgregar && (
        <div className="overlay" onClick={cerrarModalAgregar}>
          <div className="form-animado" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-form" onClick={cerrarModalAgregar}>
              ✖
            </button>
            <ClientesForm agregarCliente={agregarCliente} />
          </div>
        </div>
      )}

      {/* Mensaje flotante */}
      {mensaje && <div className={`modal-exito ${tipoMensaje}`}>{mensaje}</div>}
    </div>
  );
}

export default Clientes;

