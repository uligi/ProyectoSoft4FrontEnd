import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faEdit,
  faTrash,
  faBriefcase,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const GestionPortafolio = () => {
  const [portafolios, setPortafolios] = useState([]);
  const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    listarPortafolios();
  }, []);

  const listarPortafolios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPortafolio/ListaPortafolios"
      );
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error al listar portafolios:", error);
    }
  };

  const abrirModal = (portafolio) => {
    setPortafolioSeleccionado(
      portafolio || {
        idPortafolio: 0,
        NombrePortafolio: "",
        Descripcion: "",
        Activo: true,
      }
    );
    setMensajeError(""); // Limpiar errores anteriores
    setModalVisible(true);
  };

  const guardarPortafolio = async () => {
    const { idPortafolio, NombrePortafolio, Descripcion } =
      portafolioSeleccionado;

    if (!NombrePortafolio || !Descripcion) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const portafolio = {
        NombrePortafolio,
        Descripcion,
      };

      const url =
        idPortafolio === 0
          ? "http://localhost:5234/api/ApiPortafolio/NuevoPortafolio"
          : `http://localhost:5234/api/ApiPortafolio/ActualizarPortafolio/${idPortafolio}`;

      const response =
        idPortafolio === 0
          ? await axios.post(url, portafolio)
          : await axios.put(url, portafolio);

      if (response.status === 200) {
        await listarPortafolios();
        setModalVisible(false);
        setPortafolioSeleccionado(null);
        Swal.fire({
          title: "Éxito",
          text:
            idPortafolio === 0
              ? "Portafolio creado correctamente."
              : "Portafolio actualizado correctamente.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al guardar portafolio:", error);
      setMensajeError(
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
  };

  const eliminarPortafolio = async (idPortafolio) => {
    try {
      const response = await axios.delete(
        `http://localhost:5234/api/ApiPortafolio/EliminarPortafolio/${idPortafolio}`
      );
      if (response.status === 200) {
        listarPortafolios();
        Swal.fire(
          "Eliminado",
          "Portafolio eliminado correctamente.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al eliminar portafolio:", error);
      Swal.fire("Error", "No se pudo eliminar el portafolio.", "error");
    }
  };

  const confirmarEliminacion = (idPortafolio) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el portafolio y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarPortafolio(idPortafolio);
      }
    });
  };

  const reactivarPortafolio = async (idPortafolio) => {
    try {
      const response = await axios.put(
        `http://localhost:5234/api/ApiPortafolio/ReactivarPortafolio/${idPortafolio}`
      );

      if (response.status === 200) {
        Swal.fire("Éxito", "Portafolio reactivado exitosamente.", "success");
        listarPortafolios(); // Refrescar la lista de portafolios
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data ||
          "Hubo un problema al intentar reactivar el portafolio.",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FontAwesomeIcon icon={faBriefcase} className="me-2" />
          Gestión de Portafolios
        </div>
        <div className="card-body">
          <button
            className="btn btn-success mb-3 rounded-pill px-4"
            onClick={() => abrirModal(null)}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Agregar Portafolio
          </button>
          <table className="table table-striped table-hover">
            <thead className="bg-light text-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {portafolios.map((portafolio) => (
                <tr key={portafolio.idPortafolio}>
                  <td>{portafolio.idPortafolio}</td>
                  <td>{portafolio.NombrePortafolio}</td>
                  <td>{portafolio.Descripcion}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={portafolio.Activo ? faCheckCircle : faTimesCircle}
                      className={`text-${
                        portafolio.Activo ? "success" : "danger"
                      }`}
                    />
                  </td>
                  <td>
                    {portafolio.Activo ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => abrirModal(portafolio)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            confirmarEliminacion(portafolio.idPortafolio)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          reactivarPortafolio(portafolio.idPortafolio)
                        }
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
                  {portafolioSeleccionado.idPortafolio === 0
                    ? "Agregar Portafolio"
                    : "Editar Portafolio"}
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
                    value={portafolioSeleccionado.NombrePortafolio}
                    onChange={(e) =>
                      setPortafolioSeleccionado({
                        ...portafolioSeleccionado,
                        NombrePortafolio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={portafolioSeleccionado.Descripcion}
                    onChange={(e) =>
                      setPortafolioSeleccionado({
                        ...portafolioSeleccionado,
                        Descripcion: e.target.value,
                      })
                    }
                  ></textarea>
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
                  onClick={guardarPortafolio}
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

export default GestionPortafolio;
