import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarUsuarios();
    listarRoles();
  }, []);

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

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(
      usuario || {
        idUsuarios: 0,
        Nombre: "",
        Email: "",
        idRoles: 0, // Cambiado a idRoles
      }
    );
    setMensajeError(""); // Limpiar mensajes de error
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    const { idUsuarios, Nombre, Email, idRoles } = usuarioSeleccionado;

    if (!Nombre || !Email || idRoles === 0) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const usuario = {
        Nombre,
        Email,
        idRoles, // Incluido idRoles
      };

      const url =
        idUsuarios === 0
          ? "http://localhost:5234/api/ApiUsuarios/NuevoUsuario"
          : `http://localhost:5234/api/ApiUsuarios/ActualizarUsuario/${idUsuarios}`;

      const response =
        idUsuarios === 0
          ? await axios.post(url, usuario)
          : await axios.put(url, usuario);

      if (response.status === 200) {
        await listarUsuarios();
        setModalVisible(false);
        setUsuarioSeleccionado(null);
        Swal.fire({
          title: "Éxito",
          text:
            idUsuarios === 0
              ? "Usuario creado correctamente."
              : "Usuario actualizado correctamente.",
          icon: "success",
        });
      } else {
        setMensajeError("Error al guardar el usuario.");
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarUsuario = async (idUsuarios) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiUsuarios/EliminarUsuario/${idUsuarios}`
      );
      if (response.status === 200) {
        listarUsuarios();
        Swal.fire(
          "Eliminado",
          "El usuario ha sido eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al intentar eliminar el usuario.",
        "error"
      );
    }
  };

  const confirmarEliminacion = (idUsuarios) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<i class="fas fa-trash-alt"></i> Eliminar',
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(idUsuarios);
      }
    });
  };

  return (
    <div className="container mt-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="#!" className="text-primary">
            Administrar
          </a>
        </li>
        <li className="breadcrumb-item active">Usuarios</li>
      </ol>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-gradient text-white">
          <i className="fas fa-user me-2"></i> Gestión de Usuarios
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <i className="fas fa-plus-circle me-2"></i>Agregar Usuario
          </button>
          <table className="table table-hover">
            <thead className="bg-light text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.idUsuarios || index}>
                  <td>{usuario.idUsuarios}</td>
                  <td>{usuario.Nombre}</td>
                  <td>{usuario.Email}</td>
                  <td>
                    <span
                      className={`badge ${
                        usuario.Activo ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {usuario.Activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => abrirModal(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmarEliminacion(usuario.idUsuarios)}
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
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {usuarioSeleccionado.idUsuarios === 0
                    ? "Agregar Usuario"
                    : "Editar Usuario"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuarioSeleccionado.Nombre}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        Nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={usuarioSeleccionado.Email}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        Email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={usuarioSeleccionado?.idRoles || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setUsuarioSeleccionado((prev) => ({
                        ...prev,
                        idRoles: value,
                      }));
                    }}
                  >
                    <option value="0">Seleccione un Rol</option>
                    {roles.map((rol) => (
                      <option key={rol.idRoles} value={rol.idRoles}>
                        {rol.Nombre_Roles}
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
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={guardarUsuario}
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

export default GestionUsuarios;
