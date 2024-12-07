import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionComentariosTareas = () => {
  const [comentarios, setComentarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarComentarios();
    listarTareas();
    listarUsuarios();
  }, []);

  const listarComentarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiComentariosTareas/ListarComentarios"
      );
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
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
        ? {
            ...comentario,
          }
        : {
            idComentario: 0,
            Comentario: "",
            idTarea: 0,
            idUsuario: 0,
            Activo: true,
            FechaCreacion: new Date().toISOString().split("T")[0],
          }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarComentario = async () => {
    const { idComentario, Comentario, idTarea, idUsuario, Activo } =
      comentarioSeleccionado;

    if (!Comentario.trim() || idTarea === 0 || idUsuario === 0) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const comentario = {
        Comentario,
        FechaCreacion: new Date().toISOString(),
        Activo,
        idTarea,
        idUsuario,
      };

      const url =
        idComentario === 0
          ? "http://localhost:5234/api/ApiComentariosTareas/AgregarComentario"
          : `http://localhost:5234/api/ApiComentariosTareas/ActualizarComentario/${idComentario}`;

      const response =
        idComentario === 0
          ? await axios.post(url, comentario)
          : await axios.put(url, comentario);

      if (response.status === 200) {
        listarComentarios();
        setModalVisible(false);
        Swal.fire({
          title: "Éxito",
          text:
            idComentario === 0
              ? "Comentario creado correctamente."
              : "Comentario actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
      setMensajeError("Hubo un error al guardar el comentario.");
    }
  };

  const eliminarComentario = async (idComentario) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiComentariosTareas/EliminarComentario/${idComentario}`
      );
      if (response.status === 200) {
        listarComentarios();
        Swal.fire(
          "Eliminado",
          "Comentario eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
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
        <div className="card-header">Gestión de Comentarios de Tareas</div>
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
                <th>Tarea</th>
                <th>Usuario</th>
                <th>Activo</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((comentario) => (
                <tr key={comentario.idComentario}>
                  <td>{comentario.idComentario}</td>
                  <td>{comentario.Comentario}</td>
                  <td>{comentario.NombreTarea}</td>
                  <td>{comentario.NombreUsuario}</td>
                  <td>{comentario.Activo ? "Sí" : "No"}</td>
                  <td>{comentario.FechaCreacion.split("T")[0]}</td>
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
                  <label>Tarea</label>
                  <select
                    className="form-select"
                    value={comentarioSeleccionado.idTarea}
                    onChange={(e) =>
                      setComentarioSeleccionado({
                        ...comentarioSeleccionado,
                        idTarea: parseInt(e.target.value, 10),
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

export default GestionComentariosTareas;
