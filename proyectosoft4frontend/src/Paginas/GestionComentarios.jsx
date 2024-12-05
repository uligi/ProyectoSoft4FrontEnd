import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionComentarios = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [subtareas, setSubtareas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarProyectos();
    listarTareas();
    listarSubtareas();
    listarComentarios();
  }, []);

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

  const listarComentarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiComentarios/ListarComentarios"
      );
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
    }
  };

  const abrirModal = (comentario) => {
    setComentarioSeleccionado(
      comentario
        ? { ...comentario }
        : {
            idComentarios: 0,
            Comentario: "",
            FechaCreacion: new Date().toISOString(),
            Activo: true,
            Tareas_idTareas: null,
            idSubtareas: null,
            idProyectos: null,
          }
    );
    setModalVisible(true);
    setMensajeError("");
  };

  const guardarComentario = async () => {
    const {
      idComentarios,
      Comentario,
      Activo,
      Tareas_idTareas,
      idSubtareas,
      idProyectos,
    } = comentarioSeleccionado;

    if (!Comentario.trim()) {
      setMensajeError("El comentario no puede estar vacío.");
      return;
    }

    try {
      const comentario = {
        Comentario,
        Activo,
        Tareas_idTareas,
        idSubtareas,
        idProyectos,
      };

      const url =
        idComentarios === 0
          ? "http://localhost:5234/api/ApiComentarios/AgregarComentario"
          : `http://localhost:5234/api/ApiComentarios/ActualizarComentario/${idComentarios}`;

      const response =
        idComentarios === 0
          ? await axios.post(url, comentario)
          : await axios.put(url, comentario);

      if (response.status === 200) {
        await listarComentarios();
        setModalVisible(false);
        Swal.fire({
          title: "Éxito",
          text:
            idComentarios === 0
              ? "Comentario agregado correctamente."
              : "Comentario actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      setMensajeError("Error al guardar el comentario.");
    }
  };

  const eliminarComentario = async (idComentarios) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiComentarios/EliminarComentario/${idComentarios}`
      );
      if (response.status === 200) {
        await listarComentarios();
        Swal.fire(
          "Eliminado",
          "Comentario eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Comentarios</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Comentario
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Comentario</th>
                <th>Proyecto</th>
                <th>Tarea</th>
                <th>Subtarea</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((comentario) => (
                <tr key={comentario.idComentarios}>
                  <td>{comentario.idComentarios}</td>
                  <td>{comentario.Comentario}</td>
                  <td>
                    {proyectos.find(
                      (p) => p.idProyectos === comentario.idProyectos
                    )?.NombreProyecto || "N/A"}
                  </td>
                  <td>
                    {tareas.find(
                      (t) => t.idTareas === comentario.Tareas_idTareas
                    )?.NombreTareas || "N/A"}
                  </td>
                  <td>
                    {subtareas.find(
                      (s) => s.idSubtareas === comentario.idSubtareas
                    )?.NombreSubtareas || "N/A"}
                  </td>
                  <td>{comentario.Activo ? "Sí" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => abrirModal(comentario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        eliminarComentario(comentario.idComentarios)
                      }
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
                <h5 className="modal-title">Gestión de Comentario</h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Comentario</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={comentarioSeleccionado.Comentario}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        Comentario: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label>Proyecto</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.idProyectos || 0}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
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
                  <label>Tarea</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.Tareas_idTareas || 0}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        Tareas_idTareas: parseInt(e.target.value, 10),
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
                  <label>Subtarea</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.idSubtareas || 0}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        idSubtareas: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione una subtarea</option>
                    {subtareas.map((subtarea) => (
                      <option
                        key={subtarea.idSubtareas}
                        value={subtarea.idSubtareas}
                      >
                        {subtarea.NombreSubtareas}
                      </option>
                    ))}
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
                <button className="btn btn-primary" onClick={guardarComentario}>
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

export default GestionComentarios;
