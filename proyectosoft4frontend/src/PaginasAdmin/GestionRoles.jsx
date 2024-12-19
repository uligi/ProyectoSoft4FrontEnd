import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faPlusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarRoles();
    listarPermisos();
  }, []);

  const listarRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiRoles/ListaRoles"
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error al listar roles:", error);
    }
  };

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

  const abrirModal = (rol) => {
    setRolSeleccionado(
      rol || {
        idRoles: 0,
        Nombre_Roles: "",
        idPermisos: 0,
      }
    );
    setMensajeError(""); // Limpiar mensajes de error
    setModalVisible(true);
  };

  const guardarRol = async () => {
    const { idRoles, Nombre_Roles, idPermisos } = rolSeleccionado;

    if (!Nombre_Roles || idPermisos === 0) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const rol = {
        Nombre: Nombre_Roles,
        idPermisos,
      };

      const url =
        idRoles === 0
          ? "http://localhost:5234/api/ApiRoles/NuevoRol"
          : `http://localhost:5234/api/ApiRoles/ActualizarRol/${idRoles}`;

      const response =
        idRoles === 0 ? await axios.post(url, rol) : await axios.put(url, rol);

      if (response.status === 200) {
        await listarRoles();
        setModalVisible(false);
        setRolSeleccionado(null);
        Swal.fire({
          title: "Éxito",
          text:
            idRoles === 0
              ? "Rol creado correctamente."
              : "Rol actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarRol = async (idRoles) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiRoles/EliminarRol/${idRoles}`
      );
      if (response.status === 200) {
        listarRoles();
        Swal.fire("Eliminado", "Rol eliminado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      Swal.fire("Error", "No se pudo eliminar el rol.", "error");
    }
  };

  const confirmarEliminacion = (idRoles) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el rol y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarRol(idRoles);
      }
    });
  };

  const reactivarRol = async (idRoles) => {
    try {
      const response = await axios.put(
        `http://localhost:5234/api/ApiRoles/ReactivarRol/${idRoles}`
      );
      if (response.status === 200) {
        listarRoles();
        Swal.fire("Reactivado", "Rol reactivado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al reactivar rol:", error);
      Swal.fire("Error", "No se pudo reactivar el rol.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faUserShield} className="me-2" />
          Gestión de Roles
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Rol
          </button>
          <table className="table table-striped table-hover">
            <thead className="bg-light text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Permiso Asociado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.idRoles}>
                  <td>{rol.idRoles}</td>
                  <td>{rol.Nombre_Roles}</td>
                  <td>
                    {rol.Permiso ? rol.Permiso.Nombre_Permisos : "Sin permiso"}
                  </td>

                  <FontAwesomeIcon
                    icon={rol.Activo ? faCheckCircle : faTimesCircle}
                    className={`text-${rol.Activo ? "success" : "danger"}`}
                  />

                  <td>
                    {rol.Activo ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => abrirModal(rol)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmarEliminacion(rol.idRoles)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => reactivarRol(rol.idRoles)}
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="me-1"
                        />
                        Reactivar
                      </button>
                    )}
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
                  {rolSeleccionado.idRoles === 0 ? "Agregar Rol" : "Editar Rol"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Rol</label>
                  <input
                    type="text"
                    className="form-control"
                    value={rolSeleccionado.Nombre_Roles}
                    onChange={(e) =>
                      setRolSeleccionado({
                        ...rolSeleccionado,
                        Nombre_Roles: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Permisos Asociados</label>
                  <select
                    className="form-select"
                    value={rolSeleccionado.idPermisos || 0}
                    onChange={(e) =>
                      setRolSeleccionado({
                        ...rolSeleccionado,
                        idPermisos: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione un permiso</option>
                    {permisos.map((permiso) => (
                      <option
                        key={permiso.idPermisos}
                        value={permiso.idPermisos}
                      >
                        {permiso.Nombre_Permisos}
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
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={guardarRol}
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

export default GestionRoles;
