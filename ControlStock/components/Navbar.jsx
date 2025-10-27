import React from "react";
import '../stylos/Navbar.css'; // Importamos el CSS

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">StockManager</h1>
      <p className="navbar-slogan">“El poder del control, en tu pantalla.”</p>
    </nav>
  );
}
export default Navbar;