import React from "react";
import '../stylos/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">© 2025 StockManager. Todos los derechos reservados.</p>
      <div className="footer-links">
        <a href="#privacy">Política de Privacidad</a>
        <a href="#terms">Términos y Condiciones</a>
        <a href="#contacto">Contacto</a>
      </div>
    </footer>
  );
}

export default Footer;
