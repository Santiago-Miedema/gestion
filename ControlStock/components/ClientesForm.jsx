import React, { useState } from "react";
import "../stylos/clientesForm.css";

const ClientesForm = ({ agregarCliente }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.email) return;
    agregarCliente(nuevoCliente);
    setNuevoCliente({ nombre: "", apellido: "", email: "", direccion: "" });
  };

  return (
    <div className="clientes-form-container">
      <h3 className="clientes-form-titulo">Agregar nuevo cliente 🧾</h3>
      <form className="clientes-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            placeholder="Ej: Santiago"
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
          />
        </label>

        <label>
          Apellido
          <input
            type="text"
            placeholder="Ej: Miedema"
            value={nuevoCliente.apellido}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="Ej: santi@gmail.com"
            value={nuevoCliente.email}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
          />
        </label>

        <label>
          Dirección
          <input
            type="text"
            placeholder="Ej: Av. Libertad 123"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
          />
        </label>

        <button type="submit" className="btn-agregar">Agregar cliente</button>
      </form>
    </div>
  );
};

export default ClientesForm;