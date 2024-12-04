import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]); // Nuevo estado para permisos
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarRoles();
    listarPermisos(); // Cargar los permisos al montar el componente
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

  useEffect(() => {
    listarRoles();
    listarPermisos();
  }, []);

  const abrirModal = (rol) => {
    setRolSeleccionado(
      rol || {
        idRoles: 0,
        Nombre_Roles: "",
        idPermisos: 0, // Inicializar idPermisos
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

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Roles</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Rol
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Permiso Asociado</th>
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
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => abrirModal(rol)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => confirmarEliminacion(rol.idRoles)}
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
                  {rolSeleccionado.idRoles === 0 ? "Agregar Rol" : "Editar Rol"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre del Rol</label>
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
                  <label>Permisos Asociados</label>
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
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarRol}>
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
