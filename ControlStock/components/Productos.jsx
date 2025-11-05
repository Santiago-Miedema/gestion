import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [listas, setListas] = useState({
    marcas: [],
    categorias: [],
    colores: [],
    modelos: [],
  });

  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [formData, setFormData] = useState({
    id_marca: "",
    id_categoria: "",
    id_color: "",
    id_modelo: "",
    talle: "",
    stock: "",
    precio: "",
    stock_minimo: "",
  });

  const [modoNuevo, setModoNuevo] = useState({
    marca: false,
    categoria: false,
    color: false,
    modelo: false,
  });

  const [nuevoValor, setNuevoValor] = useState({
    marca: "",
    categoria: "",
    color: "",
    modelo: "",
  });

  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarProductos();
    cargarListas();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      mostrarMensaje("Error al cargar productos", true);
    }
  };

  const cargarListas = async () => {
    try {
      const [marcas, categorias, colores, modelos] = await Promise.all([
        axios.get("http://localhost:3001/marcas"),
        axios.get("http://localhost:3001/categorias"),
        axios.get("http://localhost:3001/colores"),
        axios.get("http://localhost:3001/modelos"),
      ]);

      const nuevas = {
        marcas: marcas.data || [],
        categorias: categorias.data || [],
        colores: colores.data || [],
        modelos: modelos.data || [],
      };
      setListas(nuevas);
      return nuevas;
    } catch (err) {
      console.error("Error al cargar listas:", err);
      mostrarMensaje("Error al cargar listas", true);
      // 🔹 Siempre deja las listas como arrays vacíos
      const vacias = { marcas: [], categorias: [], colores: [], modelos: [] };
      setListas(vacias);
      return vacias;
    }
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setModoEdicion(true);
      setProductoEditando(producto);
      setFormData({
        id_marca: producto.id_marca ?? "",
        id_categoria: producto.id_categoria ?? "",
        id_color: producto.id_color ?? "",
        id_modelo: producto.id_modelo ?? "",
        talle: producto.talle ?? "",
        stock: producto.stock ?? "",
        precio: producto.precio ?? "",
        stock_minimo: producto.stock_minimo ?? "",
      });
    } else {
      setModoEdicion(false);
      setProductoEditando(null);
      setFormData({
        id_marca: "",
        id_categoria: "",
        id_color: "",
        id_modelo: "",
        talle: "",
        stock: "",
        precio: "",
        stock_minimo: "",
      });
    }
    setModoNuevo({ marca: false, categoria: false, color: false, modelo: false });
    setNuevoValor({ marca: "", categoria: "", color: "", modelo: "" });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
  };

  const mostrarMensaje = (txt, esError = false) => {
    setMensaje({ txt, esError });
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      if (!formData.id_marca || !formData.id_categoria || !formData.id_modelo || !formData.id_color) {
        mostrarMensaje("Completar marca/categoría/modelo/color", true);
        return;
      }
      if (modoEdicion && productoEditando) {
        await axios.put(`http://localhost:3001/productos/${productoEditando.id_producto}`, formData);
        mostrarMensaje("Producto actualizado ✅");
      } else {
        await axios.post("http://localhost:3001/productos", formData);
        mostrarMensaje("Producto agregado ✅");
      }
      cerrarModal();
      cargarProductos();
    } catch (err) {
      console.error(err);
      mostrarMensaje("Error al guardar producto ❌", true);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3001/productos/${id}`);
      mostrarMensaje("Producto eliminado 🗑️");
      cargarProductos();
    } catch (err) {
      console.error(err);
      mostrarMensaje("Error al eliminar producto ❌", true);
    }
  };

  const handleSelectChange = (tipo, value) => {
    if (value === "nuevo") {
      setModoNuevo((s) => ({ ...s, [tipo]: true }));
      setFormData((s) => ({ ...s, [`id_${tipo}`]: "" }));
    } else {
      setModoNuevo((s) => ({ ...s, [tipo]: false }));
      setFormData((s) => ({ ...s, [`id_${tipo}`]: value }));
    }
  };

  const crearNuevoValor = async (tipo) => {
    const nombre = (nuevoValor[tipo] || "").trim();
    if (!nombre) {
      mostrarMensaje("Ingresá un nombre válido", true);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/nuevo-valor/${tipo}`, { nombre });
      const nuevas = await cargarListas();

      let nuevoId = null;
      if (res.data && (res.data.id || res.data.insertId)) {
        nuevoId = res.data.id ?? res.data.insertId;
      } else {
        const listaKey =
          tipo === "marca"
            ? "marcas"
            : tipo === "categoria"
            ? "categorias"
            : tipo === "color"
            ? "colores"
            : "modelos";
        const encontrado = (nuevas[listaKey] || []).find(
          (el) => (el[tipo] ?? "").toLowerCase() === nombre.toLowerCase()
        );
        if (encontrado) nuevoId = encontrado[`id_${tipo}`] || encontrado.id || null;
      }

      if (nuevoId) {
        setFormData((s) => ({ ...s, [`id_${tipo}`]: nuevoId }));
      }

      setModoNuevo((s) => ({ ...s, [tipo]: false }));
      setNuevoValor((s) => ({ ...s, [tipo]: "" }));
      mostrarMensaje(`${tipo} agregado ✅`);
    } catch (err) {
      console.error("Error al crear nuevo valor:", err);
      mostrarMensaje("Error al crear nuevo valor ❌", true);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    `${p.marca} ${p.modelo} ${p.categoria}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosVisibles = productosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (num) => {
    setPaginaActual(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-productos">
      <div className="productos-header">
        <h2>Productos</h2>
        <div className="productos-buttons">
          <button onClick={() => abrirModal()}>➕ Agregar Producto</button>
        </div>
      </div>

      <div className="buscador-productos">
        <input
          id="BuscadorProducto"
          className="input-buscador"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Categoría</th>
            <th>Color</th>
            <th>Talle</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Stock Mínimo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosVisibles.length ? (
            productosVisibles.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.marca}</td>
                <td>{p.modelo}</td>
                <td>{p.categoria}</td>
                <td>{p.color}</td>
                <td>{p.talle}</td>
                <td>{p.stock}</td>
                <td>{p.precio}</td>
                <td>{p.stock_minimo}</td>
                <td className="acciones">
                  <button className="btn-editar" onClick={() => abrirModal(p)}>✏️Editar</button>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(p.id_producto)}>🗑️Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-productos">No se encontraron productos</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button disabled={paginaActual === 1} onClick={() => cambiarPagina(paginaActual - 1)}>◀</button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              className={paginaActual === i + 1 ? "activo" : ""}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={paginaActual === totalPaginas} onClick={() => cambiarPagina(paginaActual + 1)}>▶</button>
        </div>
      )}

      {mensaje && (
        <div className={`modal-exito ${mensaje.esError ? "error" : ""}`}>
          {mensaje.txt}
        </div>
      )}

         {/* Modal formulario */}
      {modalAbierto && (
        <div className="overlay" onClick={cerrarModal}>
          <div className="form-animado" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-form" onClick={cerrarModal}>✖</button>
            <h3>{modoEdicion ? "Editar producto" : "Nuevo producto"}</h3>

            <form className="form-producto" onSubmit={guardarProducto}>
              {/* Marca */}
              <div className="grupo">
                <label>Marca</label>
                {!modoNuevo.marca ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={formData.id_marca}
                      onChange={(e) => handleSelectChange("marca", e.target.value)}
                      required
                    >
                      <option value="">Seleccione Marca</option>
                      {listas.marcas.map((m) => (
                        <option key={m.id_marca} value={m.id_marca}>
                          {m.marca}
                        </option>
                      ))}
                      <option value="nuevo">➕ Nueva marca</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Nueva marca"
                      value={nuevoValor.marca}
                      onChange={(e) => setNuevoValor((s) => ({ ...s, marca: e.target.value }))}
                    />
                    <button type="button" className="btn-guardar" onClick={() => crearNuevoValor("marca")}>💾</button>
                    <button type="button" className="btn-cancelar" onClick={() => setModoNuevo((s) => ({ ...s, marca: false }))}>✖</button>
                  </div>
                )}
              </div>

              {/* Categoria */}
              <div className="grupo">
                <label>Categoría</label>
                {!modoNuevo.categoria ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={formData.id_categoria}
                      onChange={(e) => handleSelectChange("categoria", e.target.value)}
                      required
                    >
                      <option value="">Seleccione Categoría</option>
                      {listas.categorias.map((c) => (
                        <option key={c.id_categoria} value={c.id_categoria}>
                          {c.categoria}
                        </option>
                      ))}
                      <option value="nuevo">➕ Nueva categoría</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Nueva categoría"
                      value={nuevoValor.categoria}
                      onChange={(e) => setNuevoValor((s) => ({ ...s, categoria: e.target.value }))}
                    />
                    <button type="button" className="btn-guardar" onClick={() => crearNuevoValor("categoria")}>💾</button>
                    <button type="button" className="btn-cancelar" onClick={() => setModoNuevo((s) => ({ ...s, categoria: false }))}>✖</button>
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="grupo">
                <label>Color</label>
                {!modoNuevo.color ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={formData.id_color}
                      onChange={(e) => handleSelectChange("color", e.target.value)}
                      required
                    >
                      <option value="">Seleccione Color</option>
                      {listas.colores.map((c) => (
                        <option key={c.id_color} value={c.id_color}>
                          {c.color}
                        </option>
                      ))}
                      <option value="nuevo">➕ Nuevo color</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Nuevo color"
                      value={nuevoValor.color}
                      onChange={(e) => setNuevoValor((s) => ({ ...s, color: e.target.value }))}
                    />
                    <button type="button" className="btn-guardar" onClick={() => crearNuevoValor("color")}>💾</button>
                    <button type="button" className="btn-cancelar" onClick={() => setModoNuevo((s) => ({ ...s, color: false }))}>✖</button>
                  </div>
                )}
              </div>

              {/* Modelo */}
              <div className="grupo">
                <label>Modelo</label>
                {!modoNuevo.modelo ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={formData.id_modelo}
                      onChange={(e) => handleSelectChange("modelo", e.target.value)}
                      required
                    >
                      <option value="">Seleccione Modelo</option>
                      {listas.modelos.map((m) => (
                        <option key={m.id_modelo} value={m.id_modelo}>
                          {m.modelo}
                        </option>
                      ))}
                      <option value="nuevo">➕ Nuevo modelo</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Nuevo modelo"
                      value={nuevoValor.modelo}
                      onChange={(e) => setNuevoValor((s) => ({ ...s, modelo: e.target.value }))}
                    />
                    <button type="button" className="btn-guardar" onClick={() => crearNuevoValor("modelo")}>💾</button>
                    <button type="button" className="btn-cancelar" onClick={() => setModoNuevo((s) => ({ ...s, modelo: false }))}>✖</button>
                  </div>
                )}
              </div>

              {/* Resto de campos */}
              <input
                name="talle"
                placeholder="Talle"
                value={formData.talle}
                onChange={handleFormChange}
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleFormChange}
                required
              />
              <input
                name="precio"
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleFormChange}
                required
              />
              <input
                name="stock_minimo"
                type="number"
                placeholder="Stock mínimo"
                value={formData.stock_minimo}
                onChange={handleFormChange}
                required
              />

              <div className="acciones" style={{ marginTop: 8 }}>
                <button type="submit" className="btn-guardar">
                  {modoEdicion ? "Guardar cambios" : "Agregar producto"}
                </button>
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
