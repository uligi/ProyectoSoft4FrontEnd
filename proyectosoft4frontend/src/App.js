import React, { useState } from "react";
import Layout from "./Layout";
import DashboardMain from "./Paginas/Dashboard";
import GestionUsuarios from "./Paginas/GestionUsuarios";
import GestionRoles from "./Paginas/GestionRoles";
import GestionPermisos from "./Paginas/GestionPermisos";
import GestionPortafolio from "./Paginas/GestionPortafolio";
import GestionEquipos from "./Paginas/GestionEquipos";
import GestionProyectos from "./Paginas/GestionProyectos";
import GestionMiembrosEquipos from "./Paginas/GestionMiembrosEquipos";
import GestionTareas from "./Paginas/GestionTareas";

const App = () => {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <DashboardMain />;
      case "usuarios":
        return <GestionUsuarios />;
      case "roles":
        return <GestionRoles />;

      case "permisos":
        return <GestionPermisos />;

      case "portafolio":
        return <GestionPortafolio />;

      case "equipos":
        return <GestionEquipos />;

      case "proyectos":
        return <GestionProyectos />;

      case "miembrosEquipos":
        return <GestionMiembrosEquipos />;

      case "tareas":
        return <GestionTareas />;

      default:
        return <h1>Página no encontrada</h1>;
    }
  };

  return <Layout setView={setView}>{renderView()}</Layout>;
};

export default App;
