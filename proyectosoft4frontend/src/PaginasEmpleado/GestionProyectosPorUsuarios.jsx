import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
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
import usePermisos from "../hooks/Permisos";

const GestionProyectosPorUsuarios = () => {
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate(); // Define navigate
  const user = JSON.parse(localStorage.getItem("user"));
  const { UserID } = usePermisos(user?.idUsuarios);

  useEffect(() => {
    listarProyectosPorUsuario();
  }, []);

  const listarProyectosPorUsuario = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiProyectos/ListaProyectosPorUsuario?idUsuario=${user.idUsuarios}`
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al listar proyectos:", error);
      Swal.fire("Error", "No se pudieron cargar los proyectos.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Proyectos</h2>
      <div className="row">
        {proyectos.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">
                  No tienes proyectos asignados
                </h5>
                <p className="card-text">
                  Actualmente no estás asignado a ningún proyecto o equipo. Por
                  favor, contacta con tu administrador para obtener más
                  información.
                </p>
              </div>
            </div>
          </div>
        ) : (
          proyectos.map((proyecto) => (
            <div className="col-md-6 col-lg-4 mb-4" key={proyecto.idProyectos}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
                    {proyecto.NombreProyecto}
                  </h5>
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
                  <p className="card-text">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2 text-secondary"
                    />
                    <strong>Inicio:</strong>{" "}
                    {new Date(proyecto.FechaInicio).toLocaleDateString() ||
                      "N/A"}
                  </p>
                  <p className="card-text">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2 text-secondary"
                    />
                    <strong>Fin:</strong>{" "}
                    {new Date(proyecto.FechaFinal).toLocaleDateString() ||
                      "N/A"}
                  </p>
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
                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() =>
                      navigate(
                        `/GestionTareasPorProyecto/${proyecto.idProyectos}`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faTasks} className="me-2" />
                    Ver Tareas
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

export default GestionProyectosPorUsuarios;
