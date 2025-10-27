import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import '../stylos/Dashboard.css'; // archivo CSS específico para el Dashboard
import Clientes from "./Clientes";
//import Productos from "./productos";
import ProductosCriticos from "./ProductosCriticos";


function Dashboard() {
  const { setIsLogged } = useContext(AuthContext);
  const navigate = useNavigate();
   const [nombreUsuario, setNombreUsuario] = useState("");

    useEffect(() => {
    // si guardaste el nombre al loguearte:
     const nombre = localStorage.getItem("nombre");
  if (nombre) setNombreUsuario(nombre);
}, []);
  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem("nombre");
    navigate("/"); // vuelve al login
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido {nombreUsuario} 👋</h1>
        
      </header>
      <hr />
      <section className="dashboard-content">
        <section className="dashboard-content2">
        <div className="panel1">
          <Clientes />
        </div>

        <div className="panel2">
          <ProductosCriticos />
        </div>
      </section>
      </section>
      
    </div>
  );
}

export default Dashboard;

