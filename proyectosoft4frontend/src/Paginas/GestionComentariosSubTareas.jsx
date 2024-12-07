import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionComentariosSubtareas = () => {
  const [comentarios, setComentarios] = useState([]);
  const [subtareas, setSubtareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarComentarios();
    listarSubtareas();
    listarUsuarios();
  }, []);

  const listarComentarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiComentariosSubtareas/ListarComentarios"
      );
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
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

  const abrirModal = (comentario) => {
    setComentarioSeleccionado(
      comentario
        ? { ...comentario }
        : {
            idComentario: 0,
            Comentario: "",
            FechaCreacion: new Date().toISOString().split("T")[0],
            Activo: true,
            idSubtarea: 0,
            idUsuario: 0,
          }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarComentario = async () => {
    const {
      idComentario,
      Comentario,
      FechaCreacion,
      Activo,
      idSubtarea,
      idUsuario,
    } = comentarioSeleccionado;

    if (!Comentario.trim() || idSubtarea === 0 || idUsuario === 0) {
      setMensajeError(
        "Los campos Comentario, Subtarea y Usuario son obligatorios."
      );
      return;
    }

    try {
      const comentarioData = {
        Comentario,
        FechaCreacion,
        Activo,
        idSubtarea,
        idUsuario,
      };

      const url =
        idComentario === 0
          ? "http://localhost:5234/api/ApiComentariosSubtareas/AgregarComentario"
          : `http://localhost:5234/api/ApiComentariosSubtareas/ActualizarComentario/${idComentario}`;

      if (idComentario === 0) {
        await axios.post(url, comentarioData);
        Swal.fire("Éxito", "Comentario agregado correctamente.", "success");
      } else {
        await axios.put(url, comentarioData);
        Swal.fire("Éxito", "Comentario actualizado correctamente.", "success");
      }

      listarComentarios();
      setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      setMensajeError("Hubo un error al procesar la solicitud.");
    }
  };

  const eliminarComentario = async (idComentario) => {
    try {
      await axios.delete(
        `http://localhost:5234/api/ApiComentariosSubtareas/EliminarComentario/${idComentario}`
      );
      Swal.fire("Eliminado", "Comentario eliminado correctamente.", "success");
      listarComentarios();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
    }
  };

  const confirmarEliminacion = (idComentario) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el comentario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarComentario(idComentario);
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Comentarios de Subtareas</div>
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
                <th>Subtarea</th>
                <th>Usuario</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((comentario) => (
                <tr key={comentario.idComentario}>
                  <td>{comentario.idComentario}</td>
                  <td>{comentario.Comentario}</td>
                  <td>{comentario.NombreSubtarea}</td>
                  <td>{comentario.NombreUsuario}</td>
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
                        confirmarEliminacion(comentario.idComentario)
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
                <h5 className="modal-title">
                  {comentarioSeleccionado.idComentario === 0
                    ? "Agregar Comentario"
                    : "Editar Comentario"}
                </h5>
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
                  <label>Subtarea</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.idSubtarea}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        idSubtarea: parseInt(e.target.value, 10),
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
                <div className="mb-3">
                  <label>Usuario</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.idUsuario}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        idUsuario: parseInt(e.target.value, 10),
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
                  <label>Activo</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.Activo ? "true" : "false"}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        Activo: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
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

export default GestionComentariosSubtareas;
