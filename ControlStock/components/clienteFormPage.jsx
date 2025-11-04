import React, { useState } from "react";
import axios from "axios";
import ClientesForm from "./ClientesForm";
import "../stylos/clientesForm.css";

function ClientesFormPage() {
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  const mostrarMensaje = (msg, tipo = "exito") => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 2000);
  };

  const agregarCliente = async (nuevoCliente) => {
    try {
      await axios.post("http://localhost:3001/clientes", nuevoCliente);
      mostrarMensaje("Cliente agregado ✅", "exito");
    } catch (error) {
      mostrarMensaje("Error al agregar cliente ❌", "error");
      console.error(error);
    }
  };

  return (
    <div className="clientes-form-page">
      <h2>Formulario de Clientes</h2>
      <ClientesForm agregarCliente={agregarCliente} />
      
      {mensaje && (
        <div className={`mensaje-flotante ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default ClientesFormPage;
