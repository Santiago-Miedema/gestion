import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import "./index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import NavbarDashboard from "../components/NavbarDashboard";
import { AuthProvider, AuthContext } from "../components/AuthContext";
import Clientes from "../components/Clientes";
import Productos from "../components/Productos";
import ProductosCriticos from "../components/ProductosCriticos";
import ClientesForm from "../components/ClientesForm";

// 🔒 Proteger rutas
function ProtectedRoute({ children }) {
  const { isLogged } = useContext(AuthContext);
  return isLogged ? children : <Navigate to="/" />;
}

// 🔙 Botón volver al Dashboard
function VolverInicio() {
  const navigate = useNavigate();
  const location = useLocation();

  const mostrarBoton =
    location.pathname.startsWith("/dashboard") &&
    location.pathname !== "/dashboard";

  if (!mostrarBoton) return null;

  return (
    <button className="volver-btn" onClick={() => navigate("/dashboard")}>
      ⬅ Volver al inicio
    </button>
  );
}

function AppContainer() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className={isDashboard ? "dashboard-page" : "login-page"}>
      {isDashboard ? <NavbarDashboard /> : <Navbar />}

      <main className="main-content">
        <div className="volver-boton">
          <VolverInicio /> {/* 🔙 botón arriba */}
        </div>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/nuevo-cliente"
            element={
              <ProtectedRoute>
                <ClientesForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/productos-criticos"
            element={
              <ProtectedRoute>
                <ProductosCriticos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;




