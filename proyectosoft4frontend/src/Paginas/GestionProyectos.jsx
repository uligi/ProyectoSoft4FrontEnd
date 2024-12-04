import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [portafolios, setPortafolios] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    listarProyectos();
    listarPortafolios();
    listarEquipos();
  }, []);

  const listarPortafolios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPortafolio/ListaPortafolios"
      );
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error al listar portafolios:", error);
    }
  };

  const listarEquipos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiEquipos/ListaEquipos"
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al listar equipos:", error);
    }
  };

  const listarProyectos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiProyectos/ListaProyectos"
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al listar proyectos:", error);
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
        idPortafolio: 0,
        Equipos_idEquipos: 0,
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
        await listarProyectos();
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
        listarProyectos();
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
      <div className="card">
        <div className="card-header">Gestión de Proyectos</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Proyecto
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Portafolio</th>
                <th>Equipo</th>
                <th>Prioridad</th>
                <th>Fecha Estimada</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr key={proyecto.idProyectos}>
                  <td>{proyecto.idProyectos}</td>
                  <td>{proyecto.NombreProyecto}</td>
                  <td>
                    {portafolios.find(
                      (portafolio) =>
                        portafolio.idPortafolio === proyecto.idPortafolio
                    )?.NombrePortafolio || "N/A"}
                  </td>
                  <td>
                    {equipos.find(
                      (equipo) =>
                        equipo.idEquipos === proyecto.Equipos_idEquipos
                    )?.NombreEquipos || "N/A"}
                  </td>
                  <td>{proyecto.Prioridad}</td>
                  <td>
                    {proyecto.FechaEstimada
                      ? new Date(proyecto.FechaEstimada).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {proyecto.FechaInicio
                      ? new Date(proyecto.FechaInicio).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {proyecto.FechaFinal
                      ? new Date(proyecto.FechaFinal).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => abrirModal(proyecto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmarEliminacion(proyecto.idProyectos)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalVisible && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {proyectoSeleccionado.idProyectos === 0
                    ? "Agregar Proyecto"
                    : "Editar Proyecto"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre del Proyecto</label>
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
                  <label>Descripción</label>
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
                  <label>Portafolio</label>
                  <select
                    className="form-select"
                    value={proyectoSeleccionado.idPortafolio}
                    onChange={(e) =>
                      setProyectoSeleccionado({
                        ...proyectoSeleccionado,
                        idPortafolio: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione un Portafolio</option>
                    {portafolios.map((portafolio) => (
                      <option
                        key={portafolio.idPortafolio}
                        value={portafolio.idPortafolio}
                      >
                        {portafolio.NombrePortafolio}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Equipo</label>
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
                  <label>Prioridad</label>
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
                  <label>Fecha Estimada</label>
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
                  <label>Fecha de Inicio</label>
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
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={proyectoSeleccionado.FechaFinal?.split("T")[0] || ""}
                    onChange={(e) =>
                      setProyectoSeleccionado({
                        ...proyectoSeleccionado,
                        FechaFinal: e.target.value,
                      })
                    }
                  />
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
  );
};

export default GestionProyectos;
