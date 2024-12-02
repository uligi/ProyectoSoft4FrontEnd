import React, { useState } from "react";
import Layout from "./Layout";
import DashboardMain from "./Paginas/Dashboard";
import GestionUsuarios from "./Paginas/GestionUsuarios";

const App = () => {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <DashboardMain />;
      case "usuarios":
        return <GestionUsuarios />;
      case "kanban":
        return <div>Tablero Kanban</div>;
      default:
        return <h1>Página no encontrada</h1>;
    }
  };

  return <Layout setView={setView}>{renderView()}</Layout>;
};

export default App;
