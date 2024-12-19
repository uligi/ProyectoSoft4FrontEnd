import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlusCircle,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const GestionEquiposPorGerente = () => {
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Equipos</h2>
        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => abrirModal(null)}
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
          Agregar Equipo
        </button>
      </div>
      <div className="row">
        {equipos.map((equipo) => (
          <div className="col-md-4 mb-4 d-flex" key={equipo.idEquipos}>
            <div
              className="card shadow-sm w-100"
              style={{ minHeight: "200px" }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  {equipo.NombreEquipos}
                </h5>
                <p className="card-text flex-grow-1">
                  Estado:{" "}
                  <span
                    className={`badge bg-${
                      equipo.Activo ? "success" : "danger"
                    }`}
                  >
                    {equipo.Activo ? "Activo" : "Inactivo"}
                  </span>
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => abrirModal(equipo)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmarEliminacion(equipo.idEquipos)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
                  <label className="form-label">Nombre del Equipo</label>
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

export default GestionEquiposPorGerente;
