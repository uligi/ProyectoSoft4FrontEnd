import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlusCircle,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const GestionEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarEquipos();
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

  const abrirModal = (equipo) => {
    setEquipoSeleccionado(
      equipo || {
        idEquipos: 0,
        NombreEquipos: "",
        Activo: true,
      }
    );
    setMensajeError(""); // Limpiar mensajes de error
    setModalVisible(true);
  };

  const guardarEquipo = async () => {
    const { idEquipos, NombreEquipos } = equipoSeleccionado;

    if (!NombreEquipos) {
      setMensajeError("El nombre del equipo es obligatorio.");
      return;
    }

    try {
      const equipo = {
        NombreEquipos,
      };

      const url =
        idEquipos === 0
          ? "http://localhost:5234/api/ApiEquipos/NuevoEquipo"
          : `http://localhost:5234/api/ApiEquipos/ActualizarEquipo/${idEquipos}`;

      const response =
        idEquipos === 0
          ? await axios.post(url, equipo)
          : await axios.put(url, equipo);

      if (response.status === 200) {
        await listarEquipos();
        setModalVisible(false);
        setEquipoSeleccionado(null);
        Swal.fire({
          title: "Éxito",
          text:
            idEquipos === 0
              ? "Equipo creado correctamente."
              : "Equipo actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarEquipo = async (idEquipos) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiEquipos/EliminarEquipo/${idEquipos}`
      );
      if (response.status === 200) {
        listarEquipos();
        Swal.fire("Eliminado", "Equipo eliminado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
      Swal.fire("Error", "No se pudo eliminar el equipo.", "error");
    }
  };

  const confirmarEliminacion = (idEquipos) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el equipo y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarEquipo(idEquipos);
      }
    });
  };

  const reactivarEquipos = async (idEquipos) => {
    try {
      const response = await axios.put(
        `http://localhost:5234/api/ApiEquipos/ReactivarEquipos/${idEquipos}`
      );

      if (response.status === 200) {
        Swal.fire("Éxito", "Equipo reactivado exitosamente.", "success");
        listarEquipos(); // Refrescar la lista de portafolios
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data ||
          "Hubo un problema al intentar reactivar el equipo.",
        "error"
      );
    }
  };
  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Gestión de Equipos
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Equipo
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
              {equipos.map((equipo) => (
                <tr key={equipo.idEquipos}>
                  <td>{equipo.idEquipos}</td>
                  <td>{equipo.NombreEquipos}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={equipo.Activo ? faCheckCircle : faTimesCircle}
                      className={`text-${equipo.Activo ? "success" : "danger"}`}
                    />
                  </td>
                  <td>
                    {equipo.Activo ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => abrirModal(equipo)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmarEliminacion(equipo.idEquipos)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => reactivarEquipos(equipo.idEquipos)}
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
                  {equipoSeleccionado.idEquipos === 0
                    ? "Agregar Equipo"
                    : "Editar Equipo"}
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
                    value={equipoSeleccionado.NombreEquipos}
                    onChange={(e) =>
                      setEquipoSeleccionado({
                        ...equipoSeleccionado,
                        NombreEquipos: e.target.value,
                      })
                    }
                  />
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
                  onClick={guardarEquipo}
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

export default GestionEquipos;
