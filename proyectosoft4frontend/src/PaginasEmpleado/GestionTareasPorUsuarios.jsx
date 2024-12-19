import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faCalendar,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import usePermisos from "../hooks/Permisos";

const GestionTareasPorUsuarios = () => {
  const [tareas, setTareas] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { UserID } = usePermisos(user?.idUsuarios);

  useEffect(() => {
    listarTareasPorUsuario();
  }, []); // Solo depende del montaje del componente

  const listarTareasPorUsuario = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiTareas/ListarTareasPorUsuario?idUsuario=${user.idUsuarios}`
      );
      setTareas(response.data);
    } catch (error) {
      console.error("Error al listar tareas:", error);
      Swal.fire("Error", "No se pudieron cargar las tareas.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Tareas</h2>
      <div className="row">
        {tareas.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">
                  No tienes tareas asignadas
                </h5>
                <p className="card-text">
                  Actualmente no estás asignado a ninguna tarea. Por favor,
                  contacta con tu administrador para obtener más información.
                </p>
              </div>
            </div>
          </div>
        ) : (
          tareas.map((tarea) => (
            <div className="col-md-6 col-lg-4 mb-4" key={tarea.idTareas}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <FontAwesomeIcon icon={faTasks} className="me-2" />
                    {tarea.NombreTareas}
                  </h5>
                  <p className="card-text">
                    <strong>Proyecto:</strong> {tarea.NombreProyecto || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Prioridad:</strong>{" "}
                    <span
                      className={`text-${
                        tarea.Prioridad === "Alta"
                          ? "danger"
                          : tarea.Prioridad === "Media"
                          ? "warning"
                          : "success"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          tarea.Prioridad === "Alta"
                            ? faExclamationCircle
                            : tarea.Prioridad === "Media"
                            ? faInfoCircle
                            : faCheckCircle
                        }
                        className="me-1"
                      />
                      {tarea.Prioridad}
                    </span>
                  </p>
                  <p className="card-text">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2 text-secondary"
                    />
                    <strong>Inicio:</strong>{" "}
                    {new Date(tarea.FechaInicio).toLocaleDateString() || "N/A"}
                  </p>
                  <p className="card-text">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2 text-secondary"
                    />
                    <strong>Fin:</strong>{" "}
                    {new Date(tarea.FechaFinal).toLocaleDateString() || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`badge bg-${
                        tarea.Estado === "Activo"
                          ? "success"
                          : tarea.Estado === "Inactivo"
                          ? "secondary"
                          : "info"
                      }`}
                    >
                      {tarea.Estado}
                    </span>
                  </p>
                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() =>
                      navigate(`/GestionVistaTarea/${tarea.idTareas}`)
                    }
                  >
                    <FontAwesomeIcon icon={faTasks} className="me-2" />
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GestionTareasPorUsuarios;
