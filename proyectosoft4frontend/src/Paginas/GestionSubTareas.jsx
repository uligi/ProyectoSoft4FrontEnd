import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionSubtareas = () => {
  const [subtareas, setSubtareas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [subtareaSeleccionada, setSubtareaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [idUsuarioSesion] = useState(1);

  useEffect(() => {
    listarSubtareas();
    listarTareas();
  }, []);

  const listarSubtareas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiSubtareas/ListarSubtareas"
      );
      setSubtareas(response.data);
    } catch (error) {
      console.error("Error al listar subtareas:", error);
    }
  };

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

  const abrirModal = (subtarea) => {
    setSubtareaSeleccionada(
      subtarea
        ? {
            ...subtarea,
            idTareas: subtarea.idTareas || 0,
            Prioridad: subtarea.Prioridad || "Media",
            FechaInicio: subtarea.FechaInicio?.split("T")[0] || "",
            FechaFinal: subtarea.FechaFinal?.split("T")[0] || "",
            Estado: subtarea.Estado || "En proceso",
          }
        : {
            idSubtareas: 0,
            NombreSubtareas: "",
            Descripcion: "",
            Prioridad: "Media",
            FechaInicio: "",
            FechaFinal: "",
            idTareas: 0,
            Estado: "Activo",
            Activo: true,
          }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarSubtarea = async () => {
    const {
      idSubtareas,
      NombreSubtareas,
      Descripcion,
      Prioridad,
      FechaInicio,
      FechaFinal,
      idTareas,
      Estado,
    } = subtareaSeleccionada;

    if (!NombreSubtareas.trim() || idTareas === 0) {
      setMensajeError("Los campos Nombre y Tarea son obligatorios.");
      return;
    }

    try {
      const subtarea = {
        NombreSubtareas,
        Descripcion: Descripcion || null,
        Prioridad: Prioridad || "Media",
        FechaInicio: FechaInicio || null,
        FechaFinal: FechaFinal || null,
        idTareas,
        Estado: Estado || "Activo",
      };

      const url =
        idSubtareas === 0
          ? "http://localhost:5234/api/ApiSubtareas/NuevaSubtarea"
          : `http://localhost:5234/api/ApiSubtareas/ActualizarSubtarea/${idSubtareas}`;

      const response =
        idSubtareas === 0
          ? await axios.post(url, subtarea)
          : await axios.put(url, subtarea);

      if (response.status === 200) {
        await listarSubtareas();
        setModalVisible(false);
        Swal.fire({
          title: "Éxito",
          text:
            idSubtareas === 0
              ? "Subtarea creada correctamente."
              : "Subtarea actualizada correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar subtarea:", error);
      setMensajeError("Hubo un error al procesar la solicitud.");
    }
  };

  const eliminarSubtarea = async (idSubtareas) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiSubtareas/EliminarSubtarea/${idSubtareas}`
      );
      if (response.status === 200) {
        await listarSubtareas();
        Swal.fire(
          "Eliminado",
          "Subtarea eliminada correctamente (borrado lógico).",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar subtarea:", error);
      Swal.fire("Error", "No se pudo eliminar la subtarea.", "error");
    }
  };

  const confirmarEliminacion = (idSubtareas) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción desactivará la subtarea.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarSubtarea(idSubtareas);
      }
    });
  };
  const listarComentarios = async (idSubtarea) => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/ApiComentariosSubtareas/ListarComentariosPorSubTarea?idSubtarea=${idSubtarea}`
      );
      setComentarios(response.data);
      setModalComentariosVisible(true);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
    }
  };

  const abrirComentarios = (Subtarea) => {
    if (!Subtarea) {
      console.error("Error: Subtarea no está definida.");
      return;
    }
    setSubtareaSeleccionada(Subtarea);
    listarComentarios(Subtarea.idSubtareas);
  };

  const editarComentario = async (id, texto) => {
    try {
      await axios.put(
        `http://localhost:5234/api/ApiComentariosSubtareas/ActualizarComentario/${id}`,
        {
          idComentario: id,
          Comentario: texto,
        }
      );

      listarComentarios(subtareaSeleccionada.idTareas);

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
        `http://localhost:5234/api/ApiComentariosSubtareas/EliminarComentario/${id}`
      );
      listarComentarios(subtareaSeleccionada.idSubtareas);
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
        idSubtarea: subtareaSeleccionada.idTareas,
        idUsuario: idUsuarioSesion,
      };

      const response = await axios.post(
        "http://localhost:5234/api/ApiComentariosSubtareas/AgregarComentario",
        comentario
      );

      if (response.status === 200) {
        setNuevoComentario(""); // Limpiar el campo de texto
        listarComentarios(subtareaSeleccionada.idTareas); // Refrescar la lista
        Swal.fire("Éxito", "Comentario agregado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error.response || error);
      Swal.fire("Error", "No se pudo agregar el comentario.", "error");
    }
  };
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Subtareas</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Subtarea
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tarea</th>
                <th>Prioridad</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subtareas.map((subtarea) => (
                <tr key={subtarea.idSubtareas}>
                  <td>{subtarea.idSubtareas}</td>
                  <td>{subtarea.NombreSubtareas}</td>
                  <td>{subtarea.Descripcion || "Sin descripción"}</td>
                  <td>{subtarea.NombreTarea || "N/A"}</td>
                  <td>{subtarea.Prioridad}</td>
                  <td>{subtarea.FechaInicio || "Sin asignar"}</td>
                  <td>{subtarea.FechaFinal || "Sin asignar"}</td>
                  <td>{subtarea.Estado || "Activo"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => abrirComentarios(subtarea)}
                    >
                      Comentarios
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => abrirModal(subtarea)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmarEliminacion(subtarea.idSubtareas)}
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
                  {subtareaSeleccionada.idSubtareas === 0
                    ? "Agregar Subtarea"
                    : "Editar Subtarea"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre de la Subtarea</label>
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
                  <label>Descripción</label>
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
                  <label>Tarea</label>
                  <select
                    className="form-select"
                    value={subtareaSeleccionada.idTareas}
                    onChange={(e) =>
                      setSubtareaSeleccionada({
                        ...subtareaSeleccionada,
                        idTareas: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione una tarea</option>
                    {tareas.map((tarea) => (
                      <option key={tarea.idTareas} value={tarea.idTareas}>
                        {tarea.NombreTareas}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Prioridad</label>
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
                  <label>Fecha Final</label>
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
                  <label>Estado</label>
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
                  onClick={() => setModalVisible(false)}
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
      {modalComentariosVisible && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Comentarios de {subtareaSeleccionada?.NombreSubtarea}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalComentariosVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group mb-3">
                  {comentarios.map((comentario) => (
                    <li
                      className="list-group-item"
                      key={comentario.idComentario}
                    >
                      {comentarioEditando === comentario.idComentario ? (
                        <>
                          <input
                            type="text"
                            className="form-control"
                            value={textoEditando}
                            onChange={(e) => setTextoEditando(e.target.value)}
                          />
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              editarComentario(
                                comentario.idComentario,
                                textoEditando
                              )
                            }
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setComentarioEditando(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          {comentario.Comentario} -{" "}
                          <small>{comentario.NombreUsuario}</small>
                          <button
                            className="btn btn-warning btn-sm ms-2"
                            onClick={() => {
                              setComentarioEditando(comentario.idComentario);
                              setTextoEditando(comentario.Comentario);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() =>
                              eliminarComentario(comentario.idComentario)
                            }
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nuevo comentario"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={agregarComentario}>
                  Agregar Comentario
                </button>
                <button
                  className="btn btn-secondary"
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

export default GestionSubtareas;
