import React, { useState, useEffect } from "react";
import axios from "axios";

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
      console.log("Usuarios recibidos:", response.data); // Muestra los datos en la consola
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
        id: 0,
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        rolID: 0, // Asegúrate de que el valor inicial de rolID sea 0
      }
    );
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    const { id, cedula, nombre, apellido, correo, rolID } = usuarioSeleccionado;

    if (!cedula || !nombre || !apellido || !correo || rolID === 0) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const url =
        id === 0
          ? "http://localhost:5234/api/ApiUsuarios/AgregarUsuario"
          : `http://localhost:5234/api/ApiUsuarios/ActualizarUsuario/${id}`;

      const response = await axios.post(url, {
        id,
        cedula,
        nombre,
        apellido,
        correo,
        rolID,
      });

      if (response.data.success) {
        listarUsuarios();
        setModalVisible(false);
      } else {
        setMensajeError("Error al guardar el usuario.");
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiUsuarios/EliminarUsuario/${id}`
      );
      if (response.data.success) {
        listarUsuarios();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="container mt-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="#!">Administrar</a>
        </li>
        <li className="breadcrumb-item active">Usuarios</li>
      </ol>

      <div className="card">
        <div className="card-header">
          <i className="fas fa-user me-1"></i> Lista de Usuarios
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar
          </button>
          <table className="table table-bordered">
            <thead>
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
                  <td>{usuario.idUsuarios}</td>{" "}
                  {/* Usa idUsuarios en lugar de cedula */}
                  <td>{usuario.Nombre}</td> {/* Usa Nombre */}
                  <td>{usuario.Email}</td>{" "}
                  {/* Usa Email para mostrar el correo */}
                  <td>{usuario.Activo ? "Sí" : "No"}</td> {/* Usa Activo */}
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => abrirModal(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminarUsuario(usuario.idUsuarios)}
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
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {usuarioSeleccionado.id === 0
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
                    value={usuarioSeleccionado.nombre}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    value={usuarioSeleccionado.apellido}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        apellido: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cédula</label>
                  <input
                    type="number"
                    className="form-control"
                    value={usuarioSeleccionado.cedula}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        cedula: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={usuarioSeleccionado.correo}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        correo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={usuarioSeleccionado.rolID || 0} // Si es undefined o null, usa 0
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        rolID: parseInt(e.target.value, 10), // Convierte a número
                      })
                    }
                  >
                    <option value="0">Seleccione un Rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id || rol.Nombre_Roles} value={rol.id}>
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
