import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Acceso/Login";
import Dashboard from "./Paginas/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cambiar-clave" element={<CambiarClave />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Route
        path="/usuarios"
        element={
          permisos.includes("Usuarios") ? (
            <GestionUsuarios />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Router>
  );
};

export default App;
