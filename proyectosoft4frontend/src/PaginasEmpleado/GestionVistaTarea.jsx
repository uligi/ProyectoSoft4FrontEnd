import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faPlusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faTasks,
  faComments,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const GestionVistaTarea = () => {
  const { idTarea } = useParams(); // Obtener el ID de la tarea desde la URL
  const [tarea, setTarea] = useState(null);
  const [subtareas, setSubtareas] = useState([]);
  const navigate = useNavigate();
  const [comentarios, setComentarios] = useState([]);
  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [comentariosSubtareas, setComentariosSubtareas] = useState([]);
  const [
    modalComentariosSubtareasVisible,
    setModalComentariosSubtareasVisible,
  ] = useState(false);
  const [subtareaSeleccionada, setSubtareaSeleccionada] = useState({
    idSubtareas: 0,
    NombreSubtareas: "",
    Descripcion: "",
    idTareas: 0,
    Prioridad: "Media",
    FechaInicio: "",
    FechaFinal: "",
    Estado: "Pendiente",
  });

  const [nuevoComentarioSubtarea, setNuevoComentarioSubtarea] = useState("");
  const [comentarioEditandoSubtarea, setComentarioEditandoSubtarea] =
    useState(null);
  const [textoEditandoSubtarea, setTextoEditandoSubtarea] = useState("");

  const [modalSubtareasVisible, setModalSubtareasVisible] = useState(false);

  const [mensajeError, setMensajeError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

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

  const editarComentario = async (id, texto) => {
    try {
      await axios.put(
        `http://localhost:5234/api/ApiComentariosTareas/ActualizarComentario/${id}`,
        {
          idComentario: id,
          Comentario: texto,
        }
      );

      listarComentarios(tarea.idTareas);

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
      listarComentarios(tarea.idTareas);
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
        idTarea: tarea.idTareas,
        idUsuario: user?.idUsuarios,
      };

      const response = await axios.post(
        "http://localhost:5234/api/ApiComentariosTareas/AgregarComentario",
        comentario
      );

      if (response.status === 200) {
        setNuevoComentario(""); // Limpiar el campo de texto
        listarComentarios(tarea.idTareas); // Refrescar la lista
        Swal.fire("Éxito", "Comentario agregado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error.response || error);
      Swal.fire("Error", "No se pudo agregar el comentario.", "error");
    }
  };

  const listarComentariosSubtarea = async (idSubtarea) => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiComentariosSubtareas/ListarComentariosPorSubTarea?idSubtarea=${idSubtarea}`
      );
      setComentariosSubtareas(response.data);
      setModalComentariosSubtareasVisible(true);
    } catch (error) {
      console.error("Error al listar comentarios de subtarea:", error);
    }
  };

  const agregarComentarioSubtarea = async () => {
    if (!nuevoComentarioSubtarea.trim()) {
      Swal.fire("Error", "El comentario no puede estar vacío.", "error");
      return;
    }

    try {
      const fechaActual = new Date().toISOString();
      const comentario = {
        Comentario: nuevoComentarioSubtarea,
        FechaCreacion: fechaActual,
        idSubtarea: subtareaSeleccionada.idSubtareas,
        idUsuario: user?.idUsuarios,
      };

      const response = await axios.post(
        "http://localhost:5234/api/ApiComentariosSubtareas/AgregarComentario",
        comentario
      );

      if (response.status === 200) {
        setNuevoComentarioSubtarea(""); // Limpiar campo
        listarComentariosSubtarea(subtareaSeleccionada.idSubtareas); // Refrescar lista
        Swal.fire("Éxito", "Comentario agregado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al agregar comentario de subtarea:", error);
      Swal.fire("Error", "No se pudo agregar el comentario.", "error");
    }
  };

  const editarComentarioSubtarea = async (id, texto) => {
    try {
      await axios.put(
        `http://localhost:5234/api/ApiComentariosSubtareas/ActualizarComentario/${id}`,
        { idComentario: id, Comentario: texto }
      );
      listarComentariosSubtarea(subtareaSeleccionada.idSubtareas);
      setComentarioEditandoSubtarea(null);
      Swal.fire(
        "Actualizado",
        "Comentario actualizado correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar comentario de subtarea:", error);
      Swal.fire("Error", "No se pudo actualizar el comentario.", "error");
    }
  };

  const eliminarComentarioSubtarea = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5234/api/ApiComentariosSubtareas/EliminarComentario/${id}`
      );
      listarComentariosSubtarea(subtareaSeleccionada.idSubtareas);
      Swal.fire("Eliminado", "Comentario eliminado correctamente.", "success");
    } catch (error) {
      console.error("Error al eliminar comentario de subtarea:", error);
      Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
    }
  };

  const abrirModalSubtareas = () => {
    if (!tarea?.idTareas) {
      setMensajeError(
        "No se puede agregar subtareas hasta que la tarea esté cargada."
      );
      return;
    }

    setSubtareaSeleccionada({
      idSubtareas: 0,
      NombreSubtareas: "",
      Descripcion: "",
      idTareas: tarea.idTareas, // Asegúrate de que idTareas esté definido
      Prioridad: "Media",
      FechaInicio: new Date().toISOString().split("T")[0],
      FechaFinal: "",
      Estado: "Pendiente",
    });

    setMensajeError(""); // Limpiar cualquier mensaje previo
    setModalSubtareasVisible(true);
  };

  const guardarSubtarea = async () => {
    const {
      NombreSubtareas,
      Descripcion,
      Prioridad,
      FechaInicio,
      FechaFinal,
      idTareas,
      Estado,
    } = subtareaSeleccionada;

    // Validar campos requeridos
    if (!NombreSubtareas.trim() || !idTareas) {
      setMensajeError("Los campos Nombre y Tarea son obligatorios.");
      return;
    }

    try {
      // Crear un objeto para enviar al backend
      const nuevaSubtarea = {
        NombreSubtareas,
        Descripcion: Descripcion || null,
        Prioridad: Prioridad || "Media",
        FechaInicio: FechaInicio || null,
        FechaFinal: FechaFinal || null,
        idTareas,
        Estado: Estado || "Pendiente",
      };
      console.log(nuevaSubtarea);

      // URL para agregar nuevas subtareas
      const url = "http://localhost:5234/api/ApiSubtareas/NuevaSubtarea";

      // Enviar solicitud POST
      const response = await axios.post(url, nuevaSubtarea);

      if (response.status === 200) {
        setModalSubtareasVisible(false); // Cerrar el modal
        obtenerSubtareasPorTareaID(); // Actualizar la lista de subtareas
        Swal.fire({
          title: "Éxito",
          text: "Subtarea creada correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar subtarea:", error);
      setMensajeError("Hubo un error al procesar la solicitud.");
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
          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={() =>
              listarComentarios(tarea.idTareas || tarea.id || tarea.idTarea)
            }
          >
            <FontAwesomeIcon icon={faComments} className="me-2" />
            Ver Comentarios
          </button>
          <br />
          <button
            className="btn btn-success w-100"
            onClick={
              () => abrirModalSubtareas(true) // Abre el modal directamente
            }
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Subtarea
          </button>
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
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    setSubtareaSeleccionada(subtarea);
                    listarComentariosSubtarea(subtarea.idSubtareas);
                  }}
                >
                  <FontAwesomeIcon icon={faComments} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          No se encontraron subtareas para esta tarea.
        </div>
      )}{" "}
      {modalComentariosVisible && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-secondary text-white">
                <h5 className="modal-title">
                  Comentarios de {tarea.NombreTarea}
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
                          {/* Mostrar el nombre del usuario y el comentario */}
                          <div>
                            <strong>{comentario.NombreUsuario}:</strong>{" "}
                            {comentario.Comentario}
                          </div>
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
      )}{" "}
      {modalComentariosSubtareasVisible && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-secondary text-white">
                <h5 className="modal-title">
                  Comentarios de {subtareaSeleccionada.NombreSubtareas}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalComentariosSubtareasVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group mb-3">
                  {comentariosSubtareas.map((comentario) => (
                    <li
                      key={comentario.idComentario}
                      className="list-group-item d-flex justify-content-between"
                    >
                      {comentarioEditandoSubtarea ===
                      comentario.idComentario ? (
                        <>
                          <input
                            type="text"
                            className="form-control me-2"
                            value={textoEditandoSubtarea}
                            onChange={(e) =>
                              setTextoEditandoSubtarea(e.target.value)
                            }
                          />
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              editarComentarioSubtarea(
                                comentario.idComentario,
                                textoEditandoSubtarea
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{comentario.Comentario}</span>
                          <div>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => {
                                setComentarioEditandoSubtarea(
                                  comentario.idComentario
                                );
                                setTextoEditandoSubtarea(comentario.Comentario);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                eliminarComentarioSubtarea(
                                  comentario.idComentario
                                )
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nuevo comentario"
                  value={nuevoComentarioSubtarea}
                  onChange={(e) => setNuevoComentarioSubtarea(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={agregarComentarioSubtarea}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                  Agregar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalComentariosSubtareasVisible(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {modalSubtareasVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {subtareaSeleccionada.idSubtareas === 0
                    ? "Agregar Subtarea"
                    : "Editar Subtarea"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalSubtareasVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre de la Subtarea</label>
                  <input
                    type="text"
                    className="form-control"
                    value={subtareaSeleccionada.NombreSubtareas}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
                        NombreSubtareas: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={subtareaSeleccionada.Descripcion}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
                        Descripcion: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tarea</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tarea?.NombreTareas || "Cargando..."}
                    readOnly // Hace el campo solo lectura
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-select"
                    value={subtareaSeleccionada.Prioridad}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
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
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={subtareaSeleccionada.FechaInicio}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
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
                    value={subtareaSeleccionada.FechaFinal}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
                        FechaFinal: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={subtareaSeleccionada.Estado}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
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
                  onClick={() => setModalSubtareasVisible(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={guardarSubtarea}>
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

export default GestionVistaTarea;
