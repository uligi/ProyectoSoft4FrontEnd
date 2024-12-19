import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const GestionMiembrosEquipos = () => {
  const [miembros, setMiembros] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarEquipos();
    listarUsuarios();
    listarMiembros();
  }, []);

  const listarEquipos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiEquipos/ListaEquipos"
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al listar equipos:", error);
    }
  };

  const listarUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiUsuarios/ListaUsuariosActivos"
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al listar usuarios:", error);
    }
  };

  const listarMiembros = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiMiembros/ListarTodosLosMiembros"
      );
      setMiembros(response.data);
    } catch (error) {
      console.error("Error al listar miembros:", error);
    }
  };

  const abrirModal = (miembro) => {
    setMiembroSeleccionado(
      miembro || {
        idMiembros_de_equipos: 0,
        idEquipos: 0,
        idUsuarios: 0,
      }
    );
    setMensajeError("");
    setModalVisible(true);
  };

  const guardarMiembro = async (forzar = false) => {
    const { idMiembros_de_equipos, idEquipos, idUsuarios } =
      miembroSeleccionado;

    if (!idEquipos || !idUsuarios) {
      setMensajeError("Debe seleccionar un equipo y un usuario.");
      return;
    }

    const payload = {
      idEquipos: parseInt(idEquipos, 10),
      idUsuarios: parseInt(idUsuarios, 10),
      forzar: forzar, // Aquí mantenemos el valor correctamente
    };

    console.log("Payload enviado:", payload);

    try {
      const url =
        idMiembros_de_equipos === 0
          ? "http://localhost:5234/api/ApiMiembros/NuevoMiembro"
          : `http://localhost:5234/api/ApiMiembros/ActualizarMiembro/${idMiembros_de_equipos}`;

      const response =
        idMiembros_de_equipos === 0
          ? await axios.post(url, payload) // Nuevo miembro
          : await axios.put(url, payload); // Actualizar miembro existente

      const respuesta = response.data[0];

      // Lógica específica para el Código -4
      if (respuesta.Codigo === -4 && !forzar) {
        console.log("Código -4 recibido. Mostrando alerta de confirmación.");
        Swal.fire({
          title: "Advertencia",
          text: respuesta.Mensaje,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Agregar de todos modos",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log("Confirmación para forzar el guardado.");
            await guardarMiembro(true); // Llamada explícita con forzar = true
          }
        });
        return; // Detenemos aquí para evitar llamadas adicionales
      }
      if (respuesta.Codigo === -5 && !forzar) {
        console.log("Código -5 recibido. Mostrando alerta de confirmación.");
        Swal.fire({
          title: "Advertencia",
          text: respuesta.Mensaje,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Forzar Actualización",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log("Confirmación para forzar la actualización.");
            await guardarMiembro(true); // Llama nuevamente con forzar = true
          }
        });
        return; // Evita continuar hasta que el usuario confirme
      }

      // Caso de éxito
      if (respuesta.Codigo === 1) {
        await listarMiembros();
        setModalVisible(false);
        Swal.fire("Éxito", "Miembro guardado exitosamente.", "success");
      } else if (respuesta.Codigo === -3) {
        Swal.fire("Error", respuesta.Mensaje, "error");
      } else {
        Swal.fire("Error", "Respuesta inesperada del servidor.", "error");
      }
    } catch (error) {
      console.error("Error al guardar miembro:", error);
      setMensajeError("Hubo un error al procesar la solicitud.");
    }
  };

  const eliminarMiembro = async (idMiembro) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiMiembros/EliminarMiembro/${idMiembro}`
      );
      if (response.status === 200) {
        await listarMiembros();
        Swal.fire("Eliminado", "Miembro eliminado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      Swal.fire("Error", "No se pudo eliminar el miembro.", "error");
    }
  };

  const confirmarEliminacion = (idMiembro) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al miembro del equipo y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarMiembro(idMiembro);
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Gestión de Miembros de Equipos</div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3"
            onClick={() => abrirModal(null)}
          >
            Agregar Miembro
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipo</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((miembro) => (
                <tr key={miembro.idMiembros_de_equipos}>
                  <td>{miembro.idMiembros_de_equipos}</td>
                  <td>{miembro.NombreEquipos}</td> {/* Cambiar aquí */}
                  <td>{miembro.NombreUsuario}</td>
                  <td>
                    {/* Botón Editar */}
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => abrirModal(miembro)}
                    >
                      Editar
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        confirmarEliminacion(miembro.idMiembros_de_equipos)
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
                  {miembroSeleccionado.idMiembros_de_equipos === 0
                    ? "Agregar Miembro"
                    : "Editar Miembro"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Equipo</label>
                  <select
                    className="form-select"
                    value={miembroSeleccionado.idEquipos}
                    onChange={(e) =>
                      setMiembroSeleccionado({
                        ...miembroSeleccionado,
                        idEquipos: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="0">Seleccione un equipo</option>
                    {equipos.map((equipo) => (
                      <option key={equipo.idEquipos} value={equipo.idEquipos}>
                        {equipo.NombreEquipos}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Usuario</label>
                  <select
                    className="form-select"
                    value={miembroSeleccionado.idUsuarios}
                    onChange={(e) =>
                      setMiembroSeleccionado({
                        ...miembroSeleccionado,
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
                <button
                  className="btn btn-primary"
                  onClick={() => guardarMiembro()}
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

export default GestionMiembrosEquipos;
