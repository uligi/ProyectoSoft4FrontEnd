import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Login from "./Acceso/Login";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout
                setView={() => {}}
                userName={user?.Nombre}
                onLogout={onLogout}
              >
                <DashboardMain />
              </Layout>
            </ProtectedRoute>
          }
        >
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
