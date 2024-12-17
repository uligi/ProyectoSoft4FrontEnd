import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate para redirección
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const GestionSubTareasPorProyecto = () => {
  const { idProyectos } = useParams(); // Obtener el ID del proyecto desde la URL
  const [tareas, setTareas] = useState([]);
  const [proyecto, setProyecto] = useState({});
  const navigate = useNavigate(); // Definir navigate para navegación

  // Cargar tareas al iniciar el componente
  useEffect(() => {
    cargarTareas();
    cargarDetallesProyecto();
  }, [idProyectos]);

  // Función para obtener tareas filtradas por proyecto
  const cargarTareas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiTareas/ListarTareasPorProyecto?idProyectos=${idProyectos}`
      );
      setTareas(response.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  // Obtener detalles del proyecto
  const cargarDetallesProyecto = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiProyectos/ListaProyectos`
      );
      const proyectoEncontrado = response.data.find(
        (p) => p.idProyectos === parseInt(idProyectos)
      );
      setProyecto(proyectoEncontrado || {});
    } catch (error) {
      console.error("Error al cargar detalles del proyecto:", error);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2 className="mb-4 text-primary">
        Tareas del Proyecto: {proyecto?.NombreProyecto || "N/A"}
      </h2>
      <div className="row">
        {tareas.length > 0 ? (
          tareas.map((tarea) => (
            <div className="col-md-6 col-lg-4 mb-4" key={tarea.idTareas}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">
                    {tarea.NombreTareas}
                  </h5>
                  <p className="card-text">
                    <strong>Descripción:</strong>{" "}
                    {tarea.Descripcion || "Sin descripción"}
                  </p>
                  <p className="card-text">
                    <strong>Prioridad:</strong> {tarea.Prioridad}
                  </p>
                  <p className="card-text">
                    <strong>Estado:</strong>{" "}
                    <FontAwesomeIcon
                      icon={
                        tarea.Estado === "Completado"
                          ? faCheckCircle
                          : tarea.Estado === "Pendiente"
                          ? faClock
                          : faExclamationCircle
                      }
                      className={`text-${
                        tarea.Estado === "Completado"
                          ? "success"
                          : tarea.Estado === "Pendiente"
                          ? "warning"
                          : "danger"
                      } me-2`}
                    />
                    {tarea.Estado}
                  </p>
                  <p className="card-text">
                    <strong>Inicio:</strong>{" "}
                    {new Date(tarea.FechaInicio).toLocaleDateString() || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Fin:</strong>{" "}
                    {new Date(tarea.FechaFinal).toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No hay tareas asignadas a este proyecto.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionSubTareasPorProyecto;
