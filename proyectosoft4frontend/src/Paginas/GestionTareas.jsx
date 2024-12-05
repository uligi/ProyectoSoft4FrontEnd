import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

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

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Tareas</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Tarea
          </button>
          <table className="table">
            <thead>
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
                  <td>{tarea.Estado || "Activo"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => abrirModal(tarea)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmarEliminacion(tarea.idTareas)}
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
                  {tareaSeleccionada.idTareas === 0
                    ? "Agregar Tarea"
                    : "Editar Tarea"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre de la Tarea</label>
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
                  <label>Descripción</label>
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
                  <label>Prioridad</label>
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
                  <label>Fecha Inicio</label>
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
                  <label>Fecha Final</label>
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
                  <label>Proyecto</label>
                  <select
                    className="form-select"
                    value={tareaSeleccionada.idProyectos}
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
                  <label>Usuario</label>
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
                  <label>Estado</label>
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
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={guardarTarea}>
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

export default GestionTareas;
