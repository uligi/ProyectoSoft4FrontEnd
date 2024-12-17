import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faProjectDiagram,
  faTasks,
  faCalendar,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const GestionProyectosPorUsuario = () => {
  const [proyectos, setProyectos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Función para listar proyectos usando useCallback
  const listarProyectosPorUsuario = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiProyectos/ListaProyectosPorRol?idUsuario=${user.idUsuarios}`
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al listar proyectos:", error);
      Swal.fire("Error", "No se pudieron cargar los proyectos.", "error");
    }
  }, [user.idUsuarios]); // Dependencia explícita

  // Ejecutar la función al montar el componente
  useEffect(() => {
    listarProyectosPorUsuario();
  }, [listarProyectosPorUsuario]); // Agregar como dependencia

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Proyectos Asignados</h2>
      <div className="row">
        {proyectos.map((proyecto) => (
          <div className="col-md-6 col-lg-4 mb-4" key={proyecto.idProyectos}>
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Título del proyecto */}
                <h5 className="card-title text-primary">
                  <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
                  {proyecto.NombreProyecto}
                </h5>

                {/* Prioridad */}
                <p className="card-text">
                  <strong>Prioridad:</strong>{" "}
                  <span
                    className={`text-${
                      proyecto.Prioridad === "Alta"
                        ? "danger"
                        : proyecto.Prioridad === "Media"
                        ? "warning"
                        : "success"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        proyecto.Prioridad === "Alta"
                          ? faExclamationCircle
                          : proyecto.Prioridad === "Media"
                          ? faInfoCircle
                          : faCheckCircle
                      }
                      className="me-1"
                    />
                    {proyecto.Prioridad}
                  </span>
                </p>

                {/* Fechas */}
                <p className="card-text">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="me-2 text-secondary"
                  />
                  <strong>Inicio:</strong>{" "}
                  {new Date(proyecto.FechaInicio).toLocaleDateString() || "N/A"}
                </p>
                <p className="card-text">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="me-2 text-secondary"
                  />
                  <strong>Fin:</strong>{" "}
                  {new Date(proyecto.FechaFinal).toLocaleDateString() || "N/A"}
                </p>

                {/* Estado */}
                <p className="card-text">
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`badge bg-${
                      proyecto.Estado === "Activo"
                        ? "success"
                        : proyecto.Estado === "Inactivo"
                        ? "secondary"
                        : "info"
                    }`}
                  >
                    {proyecto.Estado}
                  </span>
                </p>

                {/* Botón de tareas */}
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() =>
                    Swal.fire(
                      "Tareas",
                      `Aquí se mostrarán las tareas del proyecto: ${proyecto.NombreProyecto}.`,
                      "info"
                    )
                  }
                >
                  <FontAwesomeIcon icon={faTasks} className="me-2" />
                  Ver Tareas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionPortafolioPorUsuario;
