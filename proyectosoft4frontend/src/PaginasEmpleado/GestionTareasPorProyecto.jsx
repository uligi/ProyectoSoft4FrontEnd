import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GestionVistaTarea from "./GestionVistaTarea";

import Swal from "sweetalert2";
import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faPlusCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const GestionTareasPorProyecto = () => {
  const { idProyectos } = useParams(); // Obtener el ID del proyecto desde la URL
  const [tareas, setTareas] = useState([]);
  const [proyecto, setProyecto] = useState({});
  const navigate = useNavigate();
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  // Cargar tareas y detalles del proyecto
  useEffect(() => {
    cargarTareas();
    cargarDetallesProyecto();
  }, [idProyectos]);

  // Obtener tareas filtradas por proyecto
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

  const formatDate = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // Extrae solo la parte de la fecha
  };

  const abrirModal = (tarea) => {
    setTareaSeleccionada(
      tarea
        ? {
            ...tarea,
            idProyectos: tarea.idProyectos
              ? parseInt(tarea.idProyectos, 10)
              : 0,
            idUsuarios: tarea.idUsuarios ? parseInt(tarea.idUsuarios, 10) : 0,
            Prioridad: tarea.Prioridad || "Media",
            FechaInicio: tarea.FechaInicio?.split("T")[0] || "",
            FechaFinal: tarea.FechaFinal?.split("T")[0] || "",
            Estado: tarea.Estado || "En proceso",
          }
        : {
            idTareas: 0,
            NombreTareas: "",
            Descripcion: "",
            Prioridad: "Media",
            FechaInicio: "",
            FechaFinal: "",
            idProyectos: parseInt(idProyectos), // ID del proyecto actual
            idUsuarios: user?.idUsuarios || 0,
            Estado: "Activo",
            Activo: true,
          }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarTarea = async () => {
    const {
      idTareas,
      NombreTareas,
      Descripcion,
      Prioridad,
      FechaInicio,
      FechaFinal,
      idProyectos,
      idUsuarios,
      Estado,
    } = tareaSeleccionada;

    // Validar campos obligatorios
    if (!NombreTareas.trim() || idProyectos === 0) {
      setMensajeError("Los campos Nombre y Proyecto son obligatorios.");
      return;
    }

    try {
      const tarea = {
        NombreTareas,
        Descripcion: Descripcion || null,
        Prioridad: Prioridad || "Media",
        FechaInicio: formatDate(FechaInicio),
        FechaFinal: formatDate(FechaFinal),
        idProyectos,
        idUsuarios: idUsuarios || null,
        Estado: Estado || "Activo",
      };

      const url =
        idTareas === 0
          ? "http://localhost:5234/api/ApiTareas/NuevaTarea"
          : `http://localhost:5234/api/ApiTareas/ActualizarTarea/${idTareas}`;

      const response =
        idTareas === 0
          ? await axios.post(url, tarea)
          : await axios.put(url, tarea);

      if (response.status === 200) {
        await cargarTareas();
        setModalVisible(false);
        setTareaSeleccionada(null);
        Swal.fire({
          title: "Éxito",
          text:
            idTareas === 0
              ? "Tarea creada correctamente."
              : "Tarea actualizada correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      setMensajeError("Hubo un error al procesar la solicitud.");
    }
  };

  const eliminarTarea = async (idTareas) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiTareas/EliminarTarea/${idTareas}`
      );
      if (response.status === 200) {
        await cargarTareas();
        Swal.fire(
          "Eliminado",
          "Tarea eliminada correctamente (borrado lógico).",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
    }
  };

  const confirmarEliminacion = (idTareas) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción desactivará la tarea.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarTarea(idTareas);
      }
    });
  };
  // Redirigir al detalle de una tarea específica
  const verDetalleTarea = (idTarea) => {
    navigate(`/GestionDetalleTarea/${idTarea}`); // Ruta para ver detalles de tarea
  };

  return (
    <div className="container mt-4">
      {/* Botón para volver atrás */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>

      {/* Botón para agregar nueva tarea */}
      <button
        className="btn btn-success mb-3 ms-2"
        onClick={() => abrirModal(null)}
      >
        <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
        Nueva Tarea
      </button>

      {/* Información del Proyecto en una Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{proyecto.NombreProyecto || "Proyecto N/A"}</h4>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Descripción:</strong>{" "}
            {proyecto.Descripcion || "Sin descripción"}
          </p>
          <p className="card-text">
            <strong>Fecha de Inicio:</strong>{" "}
            {proyecto.FechaInicio
              ? new Date(proyecto.FechaInicio).toLocaleDateString()
              : "No disponible"}
          </p>
          <p className="card-text">
            <strong>Fecha de Finalización:</strong>{" "}
            {proyecto.FechaFinal
              ? new Date(proyecto.FechaFinal).toLocaleDateString()
              : "No disponible"}
          </p>
          <p className="card-text">
            <strong>Estado:</strong> {proyecto.Estado || "No especificado"}
          </p>
          <p className="card-text">
            <strong>Responsable:</strong>{" "}
            {proyecto.Responsable || "No asignado"}
          </p>
        </div>
      </div>

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

                  {/* Botón para ver detalle de la tarea */}
                  <button
                    className="btn btn-primary mt-2 w-100"
                    onClick={() =>
                      navigate(`/GestionVistaTarea/${tarea.idTareas}`)
                    }
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Ver Detalle
                  </button>
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
        )}{" "}
        {modalVisible && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    {tareaSeleccionada.idTareas === 0
                      ? "Agregar Tarea"
                      : "Editar Tarea"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Nombre de la Tarea */}
                  <div className="mb-3">
                    <label className="form-label">Nombre de la Tarea</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tareaSeleccionada.NombreTareas}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          NombreTareas: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Descripción */}
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={tareaSeleccionada.Descripcion}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          Descripcion: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  {/* Prioridad */}
                  <div className="mb-3">
                    <label className="form-label">Prioridad</label>
                    <select
                      className="form-select"
                      value={tareaSeleccionada.Prioridad}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          Prioridad: e.target.value,
                        })
                      }
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>

                  {/* Fecha Inicio */}
                  <div className="mb-3">
                    <label className="form-label">Fecha Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={tareaSeleccionada.FechaInicio}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          FechaInicio: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Fecha Final */}
                  <div className="mb-3">
                    <label className="form-label">Fecha Final</label>
                    <input
                      type="date"
                      className="form-control"
                      value={tareaSeleccionada.FechaFinal}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          FechaFinal: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Proyecto (Automático) */}
                  <div className="mb-3">
                    <label className="form-label">Proyecto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={proyecto.NombreProyecto || "N/A"}
                      disabled
                    />
                  </div>

                  {/* Usuario (Automático) */}
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.Nombre || "Usuario Actual"}
                      disabled
                    />
                  </div>

                  {/* Estado */}
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={tareaSeleccionada.Estado || "Activo"}
                      onChange={(e) =>
                        setTareaSeleccionada({
                          ...tareaSeleccionada,
                          Estado: e.target.value,
                        })
                      }
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </div>

                  {/* Mensaje de Error */}
                  {mensajeError && (
                    <div className="alert alert-danger">{mensajeError}</div>
                  )}
                </div>

                {/* Footer del Modal */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={guardarTarea}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionTareasPorProyecto;
