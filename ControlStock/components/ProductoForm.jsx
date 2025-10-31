import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../stylos/ProductoForm.css";

const ProductoForm = () => {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [colores, setColores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    marca: "",
    categoria: "",
    modelo: "",
    color: "",
    talle: "",
    stock: "",
    precio: "",
    stock_minimo: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resMarcas, resCategorias, resModelos, resColores, resProductos] = await Promise.all([
        axios.get("http://localhost:3001/marcas"),
        axios.get("http://localhost:3001/categorias"),
        axios.get("http://localhost:3001/modelos"),
        axios.get("http://localhost:3001/colores"),
        axios.get("http://localhost:3001/productos"),
      ]);

      setMarcas(resMarcas.data);
      setCategorias(resCategorias.data);
      setModelos(resModelos.data);
      setColores(resColores.data);
      setProductos(resProductos.data);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      Swal.fire("Error", "No se pudieron cargar los datos iniciales.", "error");
    }
  };

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleAgregar = async (e) => {
    e.preventDefault();

    if (
      !nuevoProducto.marca ||
      !nuevoProducto.categoria ||
      !nuevoProducto.modelo ||
      !nuevoProducto.color ||
      !nuevoProducto.talle ||
      !nuevoProducto.stock ||
      !nuevoProducto.precio
    ) {
      Swal.fire("Campos incompletos", "Completá todos los datos.", "warning");
      return;
    }

    try {
      // 🔹 Paso 1: pedir la contraseña
      const { value: clave } = await Swal.fire({
        title: "Confirmar alta de producto",
        input: "password",
        inputLabel: "Ingresá tu contraseña de usuario",
        inputPlaceholder: "Contraseña",
        inputAttributes: { autocapitalize: "off", autocorrect: "off" },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      });

      if (!clave) return; // Si cancela

      // 🔹 Paso 2: verificar contra el endpoint real
      const verificar = await axios.post("http://localhost:3001/verificar-clave", { clave });

      if (!verificar.data.success) {
        Swal.fire("Error", "Contraseña incorrecta.", "error");
        return;
      }

      // 🔹 Paso 3: si la clave es correcta, crear el producto
      await axios.post("http://localhost:3001/productos/agregar", nuevoProducto);

      Swal.fire("Éxito", "Producto agregado correctamente.", "success");
      setNuevoProducto({
        marca: "",
        categoria: "",
        modelo: "",
        color: "",
        talle: "",
        stock: "",
        precio: "",
        stock_minimo: "",
      });
      cargarDatos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      Swal.fire("Error", "No se pudo agregar el producto.", "error");
    }
  };

  const handleEliminar = async (id_producto) => {
    const confirm = await Swal.fire({
      title: "¿Seguro que querés eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const { value: clave } = await Swal.fire({
      title: "Confirmar eliminación",
      input: "password",
      inputLabel: "Ingresá tu contraseña para continuar",
      inputPlaceholder: "Contraseña",
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
    });

    if (!clave) return;

    try {
      const verificar = await axios.post("http://localhost:3001/verificar-clave", { clave });

      if (!verificar.data.success) {
        Swal.fire("Error", "Contraseña incorrecta.", "error");
        return;
      }

      await axios.delete(`http://localhost:3001/productos/${id_producto}`);
      Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  };

  return (
    <div className="producto-form-container">
      <h2>🧾 Gestionar productos</h2>

      <form onSubmit={handleAgregar} className="form-agregar">
        <h3>Agregar nuevo producto</h3>

        <div className="form-row">
          <label>Marca:</label>
          <input
            list="lista-marcas"
            name="marca"
            value={nuevoProducto.marca}
            onChange={handleChange}
            placeholder="Ej: Legacy"
            required
          />
          <datalist id="lista-marcas">
            {marcas.map((m) => (
              <option key={m.id_marca} value={m.marca || m.nombre} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <label>Categoría:</label>
          <input
            list="lista-categorias"
            name="categoria"
            value={nuevoProducto.categoria}
            onChange={handleChange}
            placeholder="Ej: Ropa"
            required
          />
          <datalist id="lista-categorias">
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.categoria || c.nombre} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <label>Modelo:</label>
          <input
            list="lista-modelos"
            name="modelo"
            value={nuevoProducto.modelo}
            onChange={handleChange}
            placeholder="Ej: Remera"
            required
          />
          <datalist id="lista-modelos">
            {modelos.map((m) => (
              <option key={m.id_modelo} value={m.modelo || m.nombre} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <label>Color:</label>
          <input
            list="lista-colores"
            name="color"
            value={nuevoProducto.color}
            onChange={handleChange}
            placeholder="Ej: Gris"
            required
          />
          <datalist id="lista-colores">
            {colores.map((c) => (
              <option key={c.id_color} value={c.color || c.nombre} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <label>Talle:</label>
          <input
            type="text"
            name="talle"
            value={nuevoProducto.talle}
            onChange={handleChange}
            placeholder="Ej: L"
          />
        </div>

        <div className="form-row">
          <label>Stock inicial:</label>
          <input
            type="number"
            name="stock"
            value={nuevoProducto.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Stock mínimo:</label>
          <input
            type="number"
            name="stock_minimo"
            value={nuevoProducto.stock_minimo}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            name="precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-guardar">
          ➕ Agregar producto
        </button>
      </form>

      <hr />

      <h3>Eliminar producto existente</h3>
      <div className="form-row">
        <select
          onChange={(e) => {
            const id = e.target.value;
            if (id) handleEliminar(id);
          }}
          defaultValue=""
        >
          <option value="">Seleccionar producto para eliminar</option>
          {productos.map((p) => (
            <option key={p.id_producto} value={p.id_producto}>
              [{p.id_producto}] {p.marca} - {p.modelo} ({p.categoria})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductoForm;
