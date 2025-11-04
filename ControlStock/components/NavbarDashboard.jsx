import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../stylos/NavbarDashboard.css";

function NavbarDashboard() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [menuMovil, setMenuMovil] = useState(false);
  const navbarRef = useRef(null); // 👉 referencia para detectar clics fuera

  const toggleMenu = (menu) => {
    setMenuAbierto(menuAbierto === menu ? null : menu);
  };

  // 🔹 Cierra todo al hacer clic fuera del navbar
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuAbierto(null);
        setMenuMovil(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  // 🔹 Cierra menú al navegar
  const handleNavigate = (ruta) => {
    navigate(ruta);
    setMenuAbierto(null);
    setMenuMovil(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("nombre");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar-dashboard" ref={navbarRef}>
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
              <button onClick={() => handleNavigate("/dashboard/productos")}>
                Mostrar todo
              </button>
              <button onClick={() => handleNavigate("/dashboard/productos-criticos")}>
                Productos críticos
              </button>
              <button onClick={() => handleNavigate("/dashboard/gestionar-productos")}>
                Gestionar productos
              </button>
            </div>
          )}
        </div>

        {/* === CLIENTES === */}
        <div className="menu-item">
          <button onClick={() => toggleMenu("clientes")}>Clientes ▾</button>
          {menuAbierto === "clientes" && (
            <div className="submenu">
              <button onClick={() => handleNavigate("/dashboard/clientes")}>
                Mostrar todo
              </button>
              <button onClick={() => handleNavigate("/dashboard/nuevo-cliente")}>
                Nuevo cliente
              </button>
            </div>
          )}
        </div>

        {/* === VENTAS === */}
        <div className="menu-item">
          <button onClick={() => toggleMenu("ventas")}>Ventas ▾</button>
          {menuAbierto === "ventas" && (
            <div className="submenu">
              <button onClick={() => handleNavigate("/dashboard/ventas")}>
                Mostrar todo
              </button>
              <button onClick={() => handleNavigate("/dashboard/nueva-venta")}>
                Nueva venta
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



