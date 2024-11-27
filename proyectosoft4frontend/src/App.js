import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardMain from "./Paginas/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [view, setView] = useState("dashboard"); // Estado para controlar la vista actual
  const [subtareas, setSubtareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    // Obtener subtareas
    axios
      .get("http://localhost:3001/subtareas")
      .then((response) => setSubtareas(response.data))
      .catch((error) => console.error("Error al obtener subtareas:", error));

    // Obtener proyectos
    axios
      .get("http://localhost:3001/proyectos")
      .then((response) => setProyectos(response.data))
      .catch((error) => console.error("Error al obtener proyectos:", error));
  }, []);

  // Filtrar subtareas por prioridad
  const subtareasPorPrioridad = (prioridad) =>
    subtareas.filter((subtarea) => subtarea.Prioridad === prioridad);

  return (
    <div className="container my-5">
      {view === "dashboard" ? (
        <DashboardMain />
      ) : (
        <>
          <h1 className="text-center mb-4">Tablero Kanban - DB_GP</h1>
          <div className="row">
            {["Baja", "Media", "Alta"].map((prioridad) => (
              <div className="col-md-4" key={prioridad}>
                <div className="card">
                  <div className="card-header text-center">
                    Prioridad {prioridad}
                  </div>
                  <div className="card-body">
                    {subtareasPorPrioridad(prioridad).map((subtarea) => (
                      <div className="card mb-2" key={subtarea.idSubtareas}>
                        <div className="card-body">
                          <h5>{subtarea.NombreSubtareas}</h5>
                          <p>{subtarea.Descripcion}</p>
                          <small>Fecha Inicio: {subtarea.FechaInicio}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <h2>Proyectos</h2>
            <ul className="list-group">
              {proyectos.map((proyecto) => (
                <li key={proyecto.idProyectos} className="list-group-item">
                  <h5>{proyecto.NombreProyecto}</h5>
                  <p>{proyecto.Descripcion}</p>
                  <small>Portafolio: {proyecto.NombrePortafolio}</small>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Botones para Cambiar la Vista */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setView("dashboard")}
        >
          Ir al Dashboard Principal
        </button>
        <button className="btn btn-secondary" onClick={() => setView("kanban")}>
          Ir al Tablero Kanban
        </button>
      </div>
    </div>
  );
};

export default App;
