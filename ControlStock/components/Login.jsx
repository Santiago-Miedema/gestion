import React from "react";
import '../stylos/Login.css'
import placeholderImg from '../img/logo.png'; // reemplazá con tu imagen real
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

function Login() {
    const [nombre, setUsuario] = useState("");
    const [clave, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const { setIsLogged } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, clave }),
      });

      const data = await res.json();

      if (data.success) {
         setIsLogged(true);        // marca como logueado
         localStorage.setItem("nombre", nombre); // <-- guardar nombre en localStorage
        navigate("/dashboard");   // redirige al dashboard
      } else {
        setMensaje("❌ Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setMensaje("⚠️ Error al conectar con el servidor");
    }
  };


  return (
    <div className="login-container">
      <div className="login-left">
        <img src={placeholderImg} alt="Comercio" className="login-image" />
      </div>
      <div className="login-right">
        <h2>Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario</label>
          <input type="text" id="username" placeholder="Ingresa tu usuario" value={nombre} onChange={(e)=> setUsuario(e.target.value)}/>

          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Ingresa tu contraseña" value={clave} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Ingresar</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;





