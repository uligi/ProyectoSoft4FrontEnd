import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faTasks,
  faExclamationCircle,
  faCheckDouble,
  faClock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import usePermisos from "../hooks/Permisos";

const GestionTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const { UserID } = usePermisos(user?.idUsuarios);

  useEffect(() => {
    listarTareas();
    listarProyectos();
    listarUsuarios();
  }, []);

  const listarTareas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiTareas/ListarTareas"
      );

      setTareas(response.data);
    } catch (error) {
      console.error("Error al listar tareas:", error);
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

  const listarUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiUsuarios/ListaUsuarios"
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al listar usuarios:", error);
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
            idProyectos: proyectos.find(
              (p) => p.idProyectos === tarea.idProyectos
            )
              ? tarea.idProyectos
              : 0,
            idUsuarios: usuarios.find((u) => u.idUsuarios === tarea.idUsuarios)
              ? tarea.idUsuarios
              : 0,
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
            idProyectos: 0,
            idUsuarios: 0,
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
        await listarTareas();
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
        await listarTareas();
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

  const listarComentarios = async (idTarea) => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiComentariosTareas/ListarComentariosPorTarea?idTarea=${idTarea}`
      );

      setComentarios(response.data);
      setModalComentariosVisible(true);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
    }
  };

  const abrirComentarios = (Tarea) => {
    setTareaSeleccionada(Tarea);
    listarComentarios(Tarea.idTareas);
  };

  const editarComentario = async (id, texto) => {
    try {
      await axios.put(
        `http://localhost:5234/api/ApiComentariosTareas/ActualizarComentario/${id}`,
        {
          idComentario: id,
          Comentario: texto,
        }
      );

      listarComentarios(tareaSeleccionada.idTareas);

      setComentarioEditando(null);
      Swal.fire(
        "Actualizado",
        "Comentario actualizado correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      Swal.fire("Error", "No se pudo actualizar el comentario.", "error");
    }
  };
  const eliminarComentario = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5234/api/ApiComentariosTareas/EliminarComentario/${id}`
      );
      listarComentarios(tareaSeleccionada.idTareas);
      Swal.fire("Eliminado", "Comentario eliminado correctamente.", "success");
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
    }
  };

  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) {
      Swal.fire("Error", "El comentario no puede estar vacío.", "error");
      return;
    }

    try {
      const fechaActual = new Date().toISOString();
      const comentario = {
        Comentario: nuevoComentario,
        FechaCreacion: fechaActual,
        idTarea: tareaSeleccionada.idTareas,
        idUsuario: user?.idUsuarios,
      };

      const response = await axios.post(
        "http://localhost:5234/api/ApiComentariosTareas/AgregarComentario",
        comentario
      );

      if (response.status === 200) {
        setNuevoComentario(""); // Limpiar el campo de texto
        listarComentarios(tareaSeleccionada.idTareas); // Refrescar la lista
        Swal.fire("Éxito", "Comentario agregado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error.response || error);
      Swal.fire("Error", "No se pudo agregar el comentario.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faTasks} className="me-2" />
          Gestión de Tareas
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Tarea
          </button>
          <table className="table table-striped table-hover">
            <thead className="bg-light text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Proyecto</th>
                <th>Usuario</th>
                <th>Prioridad</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.idTareas}>
                  <td>{tarea.idTareas}</td>
                  <td>{tarea.NombreTareas}</td>
                  <td>{tarea.Descripcion || "Sin descripción"}</td>
                  <td>{tarea.NombreProyecto || "N/A"}</td>
                  <td>{tarea.NombreUsuario || "N/A"}</td>
                  <td>{tarea.Prioridad}</td>
                  <td>{tarea.FechaInicio || "Sin asignar"}</td>
                  <td>{tarea.FechaFinal || "Sin asignar"}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={
                        tarea.Estado === "Completado"
                          ? faCheckDouble
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
                      }`}
                    />
                    {tarea.Estado}
                  </td>
                  <td>
                    <div
                      className="btn-group gap-1"
                      role="group"
                      aria-label="Acciones"
                    >
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => abrirComentarios(tarea)}
                      >
                        <FontAwesomeIcon icon={faComments} />
                      </button>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => abrirModal(tarea)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => confirmarEliminacion(tarea.idTareas)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="mb-3">
                  <label className="form-label">Proyecto</label>
                  <select
                    className="form-select"
                    value={tareaSeleccionada.idProyectos || 0}
                    onChange={(e) =>
                      setTareaSeleccionada({
                        ...tareaSeleccionada,
                        idProyectos: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione un proyecto</option>
                    {proyectos.map((proyecto) => (
                      <option
                        key={proyecto.idProyectos}
                        value={proyecto.idProyectos}
                      >
                        {proyecto.NombreProyecto}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <select
                    className="form-select"
                    value={tareaSeleccionada.idUsuarios || 0}
                    onChange={(e) =>
                      setTareaSeleccionada({
                        ...tareaSeleccionada,
                        idUsuarios: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.idUsuarios}
                        value={usuario.idUsuarios}
                      >
                        {usuario.Nombre}
                      </option>
                    ))}
                  </select>
                </div>

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
                {mensajeError && (
                  <div className="alert alert-danger">{mensajeError}</div>
                )}
              </div>
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

      {modalComentariosVisible && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-secondary text-white">
                <h5 className="modal-title">
                  Comentarios de {tareaSeleccionada.NombreTarea}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalComentariosVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group mb-3">
                  {comentarios.map((comentario) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={comentario.idComentario}
                    >
                      {comentarioEditando === comentario.idComentario ? (
                        <>
                          <input
                            type="text"
                            className="form-control me-2"
                            value={textoEditando}
                            onChange={(e) => setTextoEditando(e.target.value)}
                          />
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              editarComentario(
                                comentario.idComentario,
                                textoEditando
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setComentarioEditando(null)}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{comentario.Comentario}</span>
                          <div>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => {
                                setComentarioEditando(comentario.idComentario);
                                setTextoEditando(comentario.Comentario);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                eliminarComentario(comentario.idComentario)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nuevo comentario"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={agregarComentario}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                    Agregar
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={() => setModalComentariosVisible(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTareas;
