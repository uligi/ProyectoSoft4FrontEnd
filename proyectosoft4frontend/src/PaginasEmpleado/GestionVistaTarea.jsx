import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTasks } from "@fortawesome/free-solid-svg-icons";

const GestionVistaTarea = () => {
  const { idTarea } = useParams(); // Obtener el ID de la tarea desde la URL
  const [tarea, setTarea] = useState(null);
  const [subtareas, setSubtareas] = useState([]);
  const navigate = useNavigate();

  // Cargar información de la tarea y sus subtareas
  useEffect(() => {
    obtenerTareaPorID();
    obtenerSubtareasPorTareaID();
  }, [idTarea]);

  const obtenerTareaPorID = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiTareas/ObtenerTareaPorID?idTarea=${idTarea}`
      );
      setTarea(response.data);
    } catch (error) {
      console.error("Error al obtener la tarea:", error);
    }
  };

  const obtenerSubtareasPorTareaID = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiTareas/ObtenerSubtareasPorTareaID?idTarea=${idTarea}`
      );
      setSubtareas(response.data);
    } catch (error) {
      console.error("Error al obtener las subtareas:", error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Botón para volver */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Volver
      </button>

      {/* Información de la tarea */}
      {tarea ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title text-primary">
              <FontAwesomeIcon icon={faTasks} className="me-2" />
              {tarea.NombreTareas}
            </h3>
            <p>
              <strong>Descripción:</strong> {tarea.Descripcion || "N/A"}
            </p>
            <p>
              <strong>Prioridad:</strong> {tarea.Prioridad || "N/A"}
            </p>
            <p>
              <strong>Estado:</strong> {tarea.Estado || "N/A"}
            </p>
            <p>
              <strong>Fecha de Inicio:</strong>{" "}
              {new Date(tarea.FechaInicio).toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Fecha Final:</strong>{" "}
              {new Date(tarea.FechaFinal).toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          Cargando información de la tarea...
        </div>
      )}

      {/* Lista de subtareas */}
      <h4 className="mb-3">Subtareas</h4>
      {subtareas.length > 0 ? (
        <div className="row">
          {subtareas.map((subtarea) => (
            <div className="col-md-6 col-lg-4 mb-4" key={subtarea.idSubtareas}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">
                    {subtarea.NombreSubtareas}
                  </h5>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {subtarea.Descripcion || "N/A"}
                  </p>
                  <p>
                    <strong>Prioridad:</strong> {subtarea.Prioridad || "N/A"}
                  </p>
                  <p>
                    <strong>Estado:</strong> {subtarea.Estado || "N/A"}
                  </p>
                  <p>
                    <strong>Fecha de Inicio:</strong>{" "}
                    {new Date(subtarea.FechaInicio).toLocaleDateString() ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Fecha Final:</strong>{" "}
                    {new Date(subtarea.FechaFinal).toLocaleDateString() ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          No se encontraron subtareas para esta tarea.
        </div>
      )}
    </div>
  );
};

export default GestionVistaTarea;
