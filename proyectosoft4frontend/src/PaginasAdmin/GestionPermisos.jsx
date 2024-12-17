import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faPlusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const GestionPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarPermisos();
  }, []);

  const listarPermisos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPermisos/ListaPermisos"
      );
      setPermisos(response.data);
    } catch (error) {
      console.error("Error al listar permisos:", error);
    }
  };

  const abrirModal = (permiso) => {
    setPermisoSeleccionado(
      permiso || {
        idPermisos: 0,
        Nombre_Permisos: "",
        Activo: true,
      }
    );
    setMensajeError(""); // Limpiar mensajes de error
    setModalVisible(true);
  };

  const guardarPermiso = async () => {
    const { idPermisos, Nombre_Permisos, Activo } = permisoSeleccionado;

    if (!Nombre_Permisos) {
      setMensajeError("El nombre del permiso es obligatorio.");
      return;
    }

    try {
      const permiso = { Nombre_Permisos, Activo };
      const url =
        idPermisos === 0
          ? "http://localhost:5234/api/ApiPermisos/NuevoPermiso"
          : `http://localhost:5234/api/ApiPermisos/ActualizarPermiso/${idPermisos}`;

      const response =
        idPermisos === 0
          ? await axios.post(url, permiso)
          : await axios.put(url, permiso);

      if (response.status === 200) {
        await listarPermisos();
        setModalVisible(false);
        setPermisoSeleccionado(null);
        Swal.fire(
          "Éxito",
          idPermisos === 0
            ? "Permiso creado correctamente."
            : "Permiso actualizado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al guardar el permiso:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarPermiso = async (idPermisos) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiPermisos/EliminarPermiso/${idPermisos}`
      );
      if (response.status === 200) {
        listarPermisos();
        Swal.fire("Eliminado", "Permiso eliminado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
      Swal.fire("Error", "No se pudo eliminar el permiso.", "error");
    }
  };

  const confirmarEliminacion = (idPermisos) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el permiso y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarPermiso(idPermisos);
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faKey} className="me-2" />
          Gestión de Permisos
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Permiso
          </button>
          <table className="table table-striped table-hover">
            <thead className="bg-light text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((permiso) => (
                <tr key={permiso.idPermisos}>
                  <td>{permiso.idPermisos}</td>
                  <td>{permiso.Nombre_Permisos}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={permiso.Activo ? faCheckCircle : faTimesCircle}
                      className={`text-${
                        permiso.Activo ? "success" : "danger"
                      }`}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => abrirModal(permiso)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmarEliminacion(permiso.idPermisos)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
                  {permisoSeleccionado.idPermisos === 0
                    ? "Agregar Permiso"
                    : "Editar Permiso"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Permiso</label>
                  <input
                    type="text"
                    className="form-control"
                    value={permisoSeleccionado.Nombre_Permisos}
                    onChange={(e) =>
                      setPermisoSeleccionado({
                        ...permisoSeleccionado,
                        Nombre_Permisos: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Activo</label>
                  <select
                    className="form-select"
                    value={permisoSeleccionado.Activo ? "1" : "0"}
                    onChange={(e) =>
                      setPermisoSeleccionado({
                        ...permisoSeleccionado,
                        Activo: e.target.value === "1",
                      })
                    }
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
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
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={guardarPermiso}
                >
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

export default GestionPermisos;
