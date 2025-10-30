import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import "../stylos/Ventas.css";

function NuevaVenta() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const { user } = useContext(AuthContext);

  // clienteSeleccionado será un objeto { id_cliente, nombre, apellido, ... } o null
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // para el buscador
  const [productoTerm, setProductoTerm] = useState(""); // texto del input
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // objeto producto
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // cargar clientes y productos
    const cargar = async () => {
      try {
        const [r1, r2] = await Promise.all([
          axios.get("http://localhost:3001/clientes"),
          axios.get("http://localhost:3001/productos"),
        ]);
        setClientes(r1.data || []);
        setProductos(r2.data || []);
      } catch (err) {
        console.error("Error cargando clientes/productos:", err);
      }
    };
    cargar();
  }, []);

  // Agregar producto del preseleccionado al carrito
  const agregarAlCarrito = () => {
    if (!productoSeleccionado) {
      setMensaje("Seleccioná primero un producto.");
      return;
    }
    if (!cantidad || cantidad <= 0) {
      setMensaje("Cantidad inválida.");
      return;
    }
    if (productoSeleccionado.stock < cantidad) {
      setMensaje("Stock insuficiente para ese producto.");
      return;
    }

    // si ya existe el mismo producto+talle+color en el carrito, sumamos cantidades
    const index = carrito.findIndex(
      (it) =>
        it.id_producto === productoSeleccionado.id_producto &&
        it.talle === productoSeleccionado.talle &&
        it.color === productoSeleccionado.color
    );

    if (index >= 0) {
      const copia = [...carrito];
      copia[index].cantidad = copia[index].cantidad + cantidad;
      setCarrito(copia);
    } else {
      setCarrito([
        ...carrito,
        {
          ...productoSeleccionado,
          cantidad,
          precio: productoSeleccionado.precio,
        },
      ]);
    }

    // limpiar selección
    setProductoSeleccionado(null);
    setProductoTerm("");
    setCantidad(1);
    setMostrarResultados(false);
    setMensaje("");
  };

  const eliminarProducto = (index) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const total = carrito.reduce((acc, p) => acc + p.cantidad * p.precio, 0);

  // -----------------------
  // Este es el handleFinalizarVenta (va antes del return)
  // -----------------------
  const handleFinalizarVenta = async () => {
  if (!clienteSeleccionado || carrito.length === 0) {
    setMensaje("Debe seleccionar un cliente y agregar al menos un producto.");
    return;
  }

  try {
    // 🔹 Calcular importe total
    const importeTotal = carrito.reduce((sum, it) => sum + it.cantidad * it.precio, 0);

    // 🔹 Tomar id_usuario del contexto o localStorage
    // Si estás usando AuthContext, podés usar: const { user } = useContext(AuthContext);
    const id_usuario =
      (typeof user !== "undefined" && user?.id_usuario) ||
      parseInt(localStorage.getItem("id_usuario")) ||
      1; // fallback si no hay usuario logueado

    // 🔹 1) Insertar venta (espera que el backend devuelva id_venta)
    const ventaRes = await axios.post("http://localhost:3001/venta", {
      id_cliente: clienteSeleccionado.id_cliente,
      id_usuario,
      importeTotal,
    });

    const id_venta = ventaRes.data.id_venta;
    if (!id_venta) throw new Error("No se obtuvo id_venta del backend");

    // 🔹 2) Insertar los detalles de la venta y actualizar stock
    const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");

    for (const item of carrito) {
      // ➕ Insertar detalle
      await axios.post("http://localhost:3001/venta-detalle", {
        id_venta,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio: item.precio,
        fecha: fechaActual,
        tiempo_real: fechaActual,
      });

      // 🔄 Actualizar stock
      await axios.put(`http://localhost:3001/actualizar-stock/${item.id_producto}`, {
        cantidad: item.cantidad,
      });
    }

    // 🔹 Éxito
    setMensaje("✅ Venta registrada y stock actualizado correctamente.");

    // 🔄 Limpiar campos
    setClienteSeleccionado(null);
    setCarrito([]);
    setProductoTerm("");
    setProductoSeleccionado(null);
    setCantidad(1);

    // 🔄 Recargar productos para reflejar nuevo stock
    const prodRes = await axios.get("http://localhost:3001/productos");
    setProductos(prodRes.data || []);
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    setMensaje("❌ Error al registrar la venta. Ver consola.");
  }
};

  // -----------------------
  // fin handleFinalizarVenta
  // -----------------------

  // filtro simple para el buscador
  const resultados = productoTerm
    ? productos.filter((p) => {
        const termino = productoTerm.toLowerCase();
        return (
          (p.marca && p.marca.toLowerCase().includes(termino)) ||
          (p.modelo && p.modelo.toLowerCase().includes(termino)) ||
          (p.talle && p.talle.toString().toLowerCase().includes(termino)) ||
          (p.color && p.color.toLowerCase().includes(termino))
        );
      }).slice(0, 10)
    : [];

  return (
    <div className="nueva-venta-container">
      <h2>Nueva Venta</h2>

      {/* Cliente */}
      <div className="form-grupo">
        <label>Cliente:</label>
        <select
          value={clienteSeleccionado ? clienteSeleccionado.id_cliente : ""}
          onChange={(e) => {
            const id = e.target.value ? parseInt(e.target.value) : "";
            const c = clientes.find((x) => x.id_cliente === id) || null;
            setClienteSeleccionado(c);
          }}
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id_cliente} value={c.id_cliente}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Buscador de productos */}
      <div className="form-grupo" style={{ position: "relative" }}>
        <label>Buscar producto:</label>
        <input
          type="text"
          placeholder="Buscar por marca, modelo, talle o color..."
          value={productoTerm}
          onChange={(e) => {
            setProductoTerm(e.target.value);
            setMostrarResultados(true);
            setProductoSeleccionado(null);
          }}
          className="buscador-producto"
        />

        {mostrarResultados && resultados.length > 0 && (
          <div className="resultados-busqueda">
            {resultados.map((p) => (
              <div
                key={p.id_producto}
                className="item-busqueda"
                onClick={() => {
                  setProductoSeleccionado(p);
                  setProductoTerm(`${p.marca} ${p.modelo} - Talle ${p.talle} - ${p.color}`);
                  setMostrarResultados(false);
                  setCantidad(1);
                }}
              >
                <strong>{p.marca} {p.modelo}</strong> |
                Talle: {p.talle} |
                Color: {p.color} |
                Stock: {p.stock} |
                ${p.precio}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Si hay producto seleccionado mostramos cantidad y botón agregar */}
      {productoSeleccionado && (
        <div className="cantidad-agregar">
          <div>
            <strong>Seleccionado:</strong> {productoSeleccionado.marca} {productoSeleccionado.modelo} — Talle {productoSeleccionado.talle} — {productoSeleccionado.color}
          </div>
          <input
            type="number"
            value={cantidad}
            min="1"
            onChange={(e) => setCantidad(Number(e.target.value))}
            style={{ width: 80 }}
          />
          <button onClick={agregarAlCarrito}>Agregar</button>
        </div>
      )}

      {/* Tabla carrito con Talle y Color */}
      <div className="tabla-scroll">
        <table className="tabla-carrito">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talle</th>
              <th>Color</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length > 0 ? (
              carrito.map((item, i) => (
                <tr key={i}>
                  <td>{item.marca} {item.modelo}</td>
                  <td>{item.talle}</td>
                  <td>{item.color}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio}</td>
                  <td>${(item.cantidad * item.precio).toFixed(2)}</td>
                  <td>
                    <button onClick={() => eliminarProducto(i)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-productos">No hay productos en el carrito</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h3>Total: ${total.toFixed(2)}</h3>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-confirmar" onClick={handleFinalizarVenta}>
          Finalizar venta
        </button>
        <button
          onClick={() => {
            setCarrito([]);
            setMensaje("");
          }}
        >
          Vaciar carrito
        </button>
      </div>

      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
}

export default NuevaVenta;

