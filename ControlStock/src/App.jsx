import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import NuevaVenta from "../components/NuevaVenta";
import Ventas from "../components/Ventas";
import ClientesFormPage from "../components/clienteFormPage";

// 🔒 Proteger rutas
function ProtectedRoute({ children }) {
  const { isLogged } = useContext(AuthContext);
  return isLogged ? children : <Navigate to="/" />;
}

function AppContainer() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className={isDashboard ? "dashboard-page" : "login-page"}>
      {/* Navbar distinto según página */}
      {isDashboard ? <NavbarDashboard /> : <Navbar />}

      <main className="main-content">
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
                <ClientesFormPage />
              </ProtectedRoute>
            }
          />
          <Route 
          path="/clientes-form" 
          element={<ClientesFormPage />} 
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

          <Route
            path="/dashboard/nueva-venta"
            element={
              <ProtectedRoute>
                <NuevaVenta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/ventas"
            element={
              <ProtectedRoute>
                <Ventas />
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




