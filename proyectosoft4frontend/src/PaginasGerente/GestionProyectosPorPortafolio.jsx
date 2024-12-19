import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faProjectDiagram,
  faPlusCircle,
  faInfoCircle,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const GestionProyectosPorPortafolio = () => {
  const { idPortafolio } = useParams();
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [portafolio, setPortafolio] = useState({});
  const [error, setError] = useState("");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [portafolios, setPortafolios] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    if (idPortafolio) {
      listarProyectosPorPortafolio();
      cargarDetallesPortafolio();
      listarPortafolios();
      listarEquipos();
    } else {
      setError("El ID del portafolio no está disponible.");
    }
  }, [idPortafolio]);

  const listarPortafolios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPortafolio/ListaPortafoliosActivos"
      );
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error al listar portafolios:", error);
    }
  };

  const listarEquipos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiEquipos/ListaEquiposActivos"
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al listar equipos:", error);
    }
  };

  const listarProyectosPorPortafolio = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiProyectos/ListaProyectosPorPortafolio/${idPortafolio}`
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al listar proyectos:", error);
      setError("No se pudieron cargar los proyectos.");
    }
  };

  const cargarDetallesPortafolio = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiPortafolio/ListaPortafoliosActivos`
      );
      const portafolioEncontrado = response.data.find(
        (p) => p.idPortafolio === parseInt(idPortafolio)
      );
      setPortafolio(portafolioEncontrado || {});
    } catch (error) {
      console.error("Error al cargar detalles del portafolio:", error);
    }
  };

  const abrirModal = (proyecto) => {
    setProyectoSeleccionado(
      proyecto || {
        idProyectos: 0,
        NombreProyecto: "",
        Descripcion: "",
        FechaEstimada: "",
        FechaInicio: "",
        FechaFinal: "",
        Prioridad: "Media",
        idPortafolio: parseInt(idPortafolio, 10),
        Estado: "Activo",
      }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarProyecto = async () => {
    const {
      idProyectos,
      NombreProyecto,
      Descripcion,
      FechaEstimada,
      FechaInicio,
      FechaFinal,
      Prioridad,
      idPortafolio,
      Equipos_idEquipos,
      Estado,
    } = proyectoSeleccionado;

    if (
      !NombreProyecto.trim() ||
      !Descripcion.trim() ||
      !FechaEstimada ||
      !Prioridad ||
      idPortafolio === 0 ||
      Equipos_idEquipos === 0
    ) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const proyecto = {
        NombreProyecto,
        Descripcion,
        FechaEstimada: FechaEstimada || null,
        FechaInicio: FechaInicio || null,
        FechaFinal: FechaFinal || null,
        Prioridad,
        idPortafolio,
        Equipos_idEquipos,
        Estado,
      };

      const url =
        idProyectos === 0
          ? "http://localhost:5234/api/ApiProyectos/NuevoProyecto"
          : `http://localhost:5234/api/ApiProyectos/ActualizarProyecto/${idProyectos}`;

      const response =
        idProyectos === 0
          ? await axios.post(url, proyecto)
          : await axios.put(url, proyecto);

      if (response.status === 200) {
        await listarProyectosPorPortafolio();
        setModalVisible(false);
        setProyectoSeleccionado(null);
        Swal.fire({
          title: "Éxito",
          text:
            idProyectos === 0
              ? "Proyecto creado correctamente."
              : "Proyecto actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarProyecto = async (idProyectos) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiProyectos/EliminarProyecto/${idProyectos}`
      );
      if (response.status === 200) {
        listarProyectosPorPortafolio();
        Swal.fire("Eliminado", "Proyecto eliminado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      Swal.fire("Error", "No se pudo eliminar el proyecto.", "error");
    }
  };

  const confirmarEliminacion = (idProyectos) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el proyecto y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarProyecto(idProyectos);
      }
    });
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
            {portafolio.NombrePortafolio || "Portafolio N/A"}
          </h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Descripción:</strong>{" "}
            {portafolio.Descripcion || "Sin descripción"}
          </p>
        </div>
      </div>

      <button className="btn btn-success mb-3" onClick={() => abrirModal(null)}>
        <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
        Agregar Proyecto
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {proyectos.length > 0 ? (
          proyectos.map((proyecto) => (
            <div className="col-md-6 col-lg-4 mb-4" key={proyecto.idProyectos}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">
                    {proyecto.NombreProyecto}
                  </h5>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {proyecto.Descripcion || "Sin descripción"}
                  </p>
                  <p>
                    <strong>Estado:</strong> {proyecto.Estado}
                  </p>
                  <p>
                    <strong>Equipo:</strong>{" "}
                    {proyecto.NombreEquipos || "Equipo no asignado"}
                  </p>

                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() =>
                      navigate(
                        `/GestionTareasPorProyecto/${proyecto.idProyectos}`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Ver Detalle
                  </button>

                  <button
                    className="btn btn-danger w-100 mt-2"
                    onClick={() => confirmarEliminacion(proyecto.idProyectos)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              No hay proyectos en este portafolio.
            </div>
          </div>
        )}{" "}
        {modalVisible && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    {proyectoSeleccionado.idProyectos === 0
                      ? "Agregar Proyecto"
                      : "Editar Proyecto"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={proyectoSeleccionado.NombreProyecto}
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          NombreProyecto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={proyectoSeleccionado.Descripcion}
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          Descripcion: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Portafolio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={portafolio.NombrePortafolio || "Portafolio N/A"}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Equipo</label>
                    <select
                      className="form-select"
                      value={proyectoSeleccionado.Equipos_idEquipos}
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          Equipos_idEquipos: parseInt(e.target.value, 10),
                        })
                      }
                    >
                      <option value="0">Seleccione un Equipo</option>
                      {equipos.map((equipo) => (
                        <option key={equipo.idEquipos} value={equipo.idEquipos}>
                          {equipo.NombreEquipos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Prioridad</label>
                    <select
                      className="form-select"
                      value={proyectoSeleccionado.Prioridad}
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          Prioridad: e.target.value,
                        })
                      }
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha Estimada</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        proyectoSeleccionado.FechaEstimada?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          FechaEstimada: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        proyectoSeleccionado.FechaInicio?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          FechaInicio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha Fin</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        proyectoSeleccionado.FechaFinal?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
                          FechaFinal: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={proyectoSeleccionado.Estado || "Activo"}
                      onChange={(e) =>
                        setProyectoSeleccionado({
                          ...proyectoSeleccionado,
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
                  {mensajeError && (
                    <div className="alert alert-danger">{mensajeError}</div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Cerrar
                  </button>
                  <button className="btn btn-primary" onClick={guardarProyecto}>
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

export default GestionProyectosPorPortafolio;
