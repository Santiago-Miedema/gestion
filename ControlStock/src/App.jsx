import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import './index.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import NavbarDashboard from "../components/navbarDashboard";
import { AuthProvider, AuthContext } from "../components/AuthContext";
import Clientes from "../components/Clientes";
import Productos from "../components/productos";
import ProductosCriticos from "../components/ProductosCriticos";




// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const { isLogged } = useContext(AuthContext);
  return isLogged ? children : <Navigate to="/" />;
}

// Contenedor de la app que cambia clase según ruta
function AppContainer() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className={isDashboard ? "dashboard-page" : "login-page"}>
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
            path="/dashboard/productos"
            element={
              <ProtectedRoute>
               <Productos />
                
              </ProtectedRoute>}/>
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



