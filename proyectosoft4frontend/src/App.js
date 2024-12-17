import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//layout y login
import Layout from "./Layout";
import Login from "./Acceso/Login";
import CambiarClave from "./Acceso/CambiarClave";

//Dashboard
import DashboardMain from "./Dashboard";

//Admin
import GestionUsuarios from "./PaginasAdmin/GestionUsuarios";
import GestionRoles from "./PaginasAdmin/GestionRoles";
import GestionPermisos from "./PaginasAdmin/GestionPermisos";
import GestionPortafolio from "./PaginasAdmin/GestionPortafolio";
import GestionEquipos from "./PaginasAdmin/GestionEquipos";
import GestionProyectos from "./PaginasAdmin/GestionProyectos";
import GestionMiembrosEquipos from "./PaginasAdmin/GestionMiembrosEquipos";
import GestionTareas from "./PaginasAdmin/GestionTareas";
import GestionSubTareas from "./PaginasAdmin/GestionSubTareas";
import GestionComentariosProyectos from "./PaginasAdmin/GestionComentariosProyectos";
import GestionComentariosSubTareas from "./PaginasAdmin/GestionComentariosSubTareas";
import GestionComentariosTareas from "./PaginasAdmin/GestionComentariosTareas";

//Empleado
import GestionProyectosPorUsuarios from "./PaginasEmpleado/GestionProyectosPorUsuarios";
import GestionTareasPorProyecto from "./PaginasEmpleado/GestionTareasPorProyecto";
import GestionVistaTarea from "./PaginasEmpleado/GestionVistaTarea";

//Gerente
import Reportes from "./PaginasGerente/Reportes";

//Errores
import Error400 from "./PaginasErrores/400";
import Error404 from "./PaginasErrores/404";
import Error500 from "./PaginasErrores/500";

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
          <Route path="reportes" element={<Reportes />} />
          <Route
            path="GestionProyectosPorUsuarios"
            element={<GestionProyectosPorUsuarios />}
          />
          <Route
            path="GestionTareasPorProyecto/:idProyectos"
            element={<GestionTareasPorProyecto />}
          />

          <Route
            path="GestionVistaTarea/:idTarea"
            element={<GestionVistaTarea />}
          />

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
          <Route path="/error-400" element={<Error400 />} />
          <Route path="/error-404" element={<Error404 />} />
          <Route path="/error-500" element={<Error500 />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
