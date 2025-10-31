import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylos/gestionarStock.css"; // crea este CSS si querés (hay sugerencia abajo)

const GestionarStock = () => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ajuste, setAjuste] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setError("");
      const res = await axios.get("http://localhost:3001/productos");
      console.log("GET /productos ->", res.data);
      if (Array.isArray(res.data)) setProductos(res.data);
      else {
        setProductos([]);
        setError("El endpoint no devolvió un array de productos.");
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("Error al conectar con el backend. Ver consola.");
    }
  };

  // búsqueda por cualquier campo relevante
  const productosFiltrados = productos.filter((p) => {
    const text = [
      p.id_producto,
      p.marca,
      p.categoria,
      p.modelo,
      p.color,
      p.talle,
      p.stock,
      p.precio,
      p.stock_minimo,
    ]
      .join(" ")
      .toString()
      .toLowerCase();
    return text.includes(filtro.toLowerCase());
  });

  const seleccionarProducto = (p) => {
    setProductoSeleccionado(p);
    setAjuste("");
    setMensaje("");
  };

  const handleActualizarStock = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!productoSeleccionado) {
      setError("Seleccioná un producto primero.");
      return;
    }

    const ajusteNum = parseInt(ajuste, 10);
    if (isNaN(ajusteNum)) {
      setError("El ajuste debe ser un número (puede ser negativo).");
      return;
    }

    const nuevoStock = parseInt(productoSeleccionado.stock, 10) + ajusteNum;
    if (isNaN(nuevoStock)) {
      setError("Valor de stock inválido.");
      return;
    }

    try {
      // PUT al endpoint del producto - ajustá la URL si tu backend usa otra ruta
      const url = `http://localhost:3001/productos/${productoSeleccionado.id_producto}`;
      console.log("PUT", url, { stock: nuevoStock });

      const res = await axios.put(url, { stock: nuevoStock });

      // algunos backends devuelven ok booleano, otros el objeto actualizado — lo manejamos
      console.log("Respuesta PUT:", res.data);

      // actualizar estado local para reflejar nuevo stock
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === productoSeleccionado.id_producto
            ? { ...p, stock: nuevoStock }
            : p
        )
      );

      // actualizar la selección
      setProductoSeleccionado((prev) => ({ ...prev, stock: nuevoStock }));
      setMensaje(`Stock actualizado: ${nuevoStock}`);
      setAjuste("");
    } catch (err) {
      console.error("Error actualizando stock:", err);
      setError("Error al actualizar el stock. Revisá la consola.");
    }
  };

  return (
    <div className="gestionar-stock-container">
      <h3>🧰 Gestionar stock</h3>

      {error && <div className="error">{error}</div>}
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <div className="buscador-row">
        <input
          type="text"
          placeholder="Buscar por ID, marca, categoría, modelo, color..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-buscador"
        />
        <button onClick={cargarProductos} className="btn-refrescar">
          🔄 Refrescar
        </button>
      </div>

      <div className="lista-productos">
        {productosFiltrados.length === 0 ? (
          <div className="no-productos">No se encontraron productos.</div>
        ) : (
          productosFiltrados.map((p) => (
            <div
              key={p.id_producto}
              className={`item-producto ${
                productoSeleccionado?.id_producto === p.id_producto ? "activo" : ""
              }`}
              onClick={() => seleccionarProducto(p)}
            >
              <div className="item-line">
                <strong>
                  [{p.id_producto}] {p.marca} - {p.modelo}
                </strong>
                <span>Stock: {p.stock}</span>
              </div>
              <div className="item-sub">
                <span>{p.categoria} • {p.color} • Talle {p.talle} • </span>
                <span>Precio: ${p.precio}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {productoSeleccionado && (
        <form className="form-ajuste" onSubmit={handleActualizarStock}>
          <h4>
            Producto seleccionado: [{productoSeleccionado.id_producto}]{" "}
            {productoSeleccionado.marca} {productoSeleccionado.modelo}
          </h4>

          <div className="field">
            <label>Stock actual</label>
            <input type="number" value={productoSeleccionado.stock} readOnly />
          </div>

          <div className="field">
            <label>Ajuste (puede ser negativo)</label>
            <input
              type="number"
              value={ajuste}
              onChange={(e) => setAjuste(e.target.value)}
              placeholder="Ej: 5 o -3"
              required
            />
          </div>

          <div className="acciones">
            <button type="submit" className="btn-guardar">Actualizar stock</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setProductoSeleccionado(null);
                setAjuste("");
                setMensaje("");
                setError("");
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GestionarStock;
