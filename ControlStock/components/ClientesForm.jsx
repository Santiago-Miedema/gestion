<div style={{ marginBottom: "20px" }}>
  <h3>Agregar nuevo cliente</h3>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    <input
      type="text"
      placeholder="Nombre"
      value={nuevoCliente.nombre || ""}
      onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
    />
    <input
      type="text"
      placeholder="Apellido"
      value={nuevoCliente.apellido || ""}
      onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
    />
    <input
      type="email"
      placeholder="Email"
      value={nuevoCliente.email || ""}
      onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
    />
    <input
      type="text"
      placeholder="Dirección"
      value={nuevoCliente.direccion || ""}
      onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
    />
    <button onClick={agregarCliente}>Agregar</button>
  </div>
</div>
