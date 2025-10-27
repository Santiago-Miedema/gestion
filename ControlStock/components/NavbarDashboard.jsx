import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylos/NavbarDashboard.css";

function NavbarDashboard() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [menuMovil, setMenuMovil] = useState(false);

  const toggleMenu = (menu) => {
    setMenuAbierto(menuAbierto === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("nombre");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar-dashboard">
      <div className="navbar-left">
        <h1 className="navbar-title">StockManager</h1>
      </div>

      {/* Botón hamburguesa */}
      <div
        className={`hamburger ${menuMovil ? "active" : ""}`}
        onClick={() => setMenuMovil(!menuMovil)}
      >
        ☰
      </div>

      <div className={`navbar-right ${menuMovil ? "open" : ""}`}>
        {/* === STOCK === */}
        <div className="menu-item">
          <button onClick={() => toggleMenu("stock")}>Stock ▾</button>
          {menuAbierto === "stock" && (
            <div className="submenu">
              <button onClick={() => navigate("/dashboard/Productos")}>Mostrar todo</button>
              <button onClick={() => navigate("/dashboard/nuevo-producto")}>
                Agregar producto
              </button>
              <button onClick={() => navigate("/dashboard/eliminar-producto")}>
                Eliminar producto
              </button>
            </div>
          )}
        </div>

        {/* === CLIENTES === */}
        <div className="menu-item">
          <button onClick={() => toggleMenu("clientes")}>Clientes ▾</button>
          {menuAbierto === "clientes" && (
            <div className="submenu">
              <button onClick={() => navigate("/dashboard/clientes")}>Mostrar todo</button>
              <button onClick={() => navigate("/dashboard/clientesform")}>
                Nuevo cliente
              </button>
              <button onClick={() => navigate("/dashboard/eliminar-cliente")}>
                Eliminar cliente
              </button>
            </div>
          )}
        </div>

        {/* === VENTAS === */}
        <div className="menu-item">
          <button onClick={() => toggleMenu("ventas")}>Ventas ▾</button>
          {menuAbierto === "ventas" && (
            <div className="submenu">
              <button onClick={() => navigate("/dashboard/ventas")}>
                Mostrar todo
              </button>
              <button onClick={() => navigate("/dashboard/nueva-venta")}>
                Nueva venta
              </button>
              <button onClick={() => navigate("/dashboard/eliminar-venta")}>
                Eliminar venta
              </button>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default NavbarDashboard;


