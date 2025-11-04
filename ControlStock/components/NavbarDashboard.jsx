import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../stylos/NavbarDashboard.css";

function NavbarDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [menuMovil, setMenuMovil] = useState(false);
  const navbarRef = useRef(null);

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

  // 🔹 Click en el logo o título → vuelve al dashboard
  const handleLogoClick = () => {
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
    setMenuAbierto(null);
    setMenuMovil(false);
  };

  return (
    <nav className="navbar-dashboard" ref={navbarRef}>
      {/* 🔹 Logo o título clickeable */}
      <div className="navbar-left" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        {/* Si después querés un logo de imagen: <img src="/logo.png" alt="Logo" className="logo-img" /> */}
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
