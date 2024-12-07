import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Login from "./Acceso/Login";
import CambiarClave from "./Acceso/CambiarClave";
import DashboardMain from "./Paginas/Dashboard";
import GestionUsuarios from "./Paginas/GestionUsuarios";
import GestionRoles from "./Paginas/GestionRoles";
import GestionPermisos from "./Paginas/GestionPermisos";
import GestionPortafolio from "./Paginas/GestionPortafolio";
import GestionEquipos from "./Paginas/GestionEquipos";
import GestionProyectos from "./Paginas/GestionProyectos";
import GestionMiembrosEquipos from "./Paginas/GestionMiembrosEquipos";
import GestionTareas from "./Paginas/GestionTareas";
import GestionSubTareas from "./Paginas/GestionSubTareas";
import GestionComentariosProyectos from "./Paginas/GestionComentariosProyectos";
import GestionComentariosSubTareas from "./Paginas/GestionComentariosSubTareas";
import GestionComentariosTareas from "./Paginas/GestionComentariosTareas";

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData)); // Restaurar el usuario desde localStorage
    } else {
      setUser(null); // Asegurarse de limpiar el usuario si no hay token
    }

    setIsLoading(false); // Finaliza la carga inicial
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // Limpiar el estado del usuario
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Ruta para cambiar clave */}
        <Route path="/cambiar-clave" element={<CambiarClave />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout userName={user?.Nombre} onLogout={onLogout} />
            </ProtectedRoute>
          }
        >
          {/* Ruta por defecto: Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          {/* Subrutas dentro del Layout */}
          <Route path="dashboard" element={<DashboardMain />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="roles" element={<GestionRoles />} />
          <Route path="permisos" element={<GestionPermisos />} />
          <Route path="portafolio" element={<GestionPortafolio />} />
          <Route path="equipos" element={<GestionEquipos />} />
          <Route path="proyectos" element={<GestionProyectos />} />
          <Route path="miembrosEquipos" element={<GestionMiembrosEquipos />} />
          <Route path="tareas" element={<GestionTareas />} />
          <Route path="subTareas" element={<GestionSubTareas />} />
          <Route
            path="comentariosProyectos"
            element={<GestionComentariosProyectos />}
          />
          <Route
            path="comentariosTareas"
            element={<GestionComentariosTareas />}
          />
          <Route
            path="comentariosSubTareas"
            element={<GestionComentariosSubTareas />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
