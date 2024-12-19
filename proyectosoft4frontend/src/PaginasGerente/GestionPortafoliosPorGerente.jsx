import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faEdit,
  faTrash,
  faBriefcase,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const GestionPortafoliosPorGerente = () => {
  const [portafolios, setPortafolios] = useState([]);
  const [portafolioSeleccionado, setPortafolioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    listarPortafolios();
  }, []);

  const listarPortafolios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPortafolio/ListaPortafoliosActivos"
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Portafolios</h2>
        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => abrirModal(null)}
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
          Agregar Nuevo
        </button>
      </div>
      <div className="row">
        {portafolios.map((portafolio) => (
          <div className="col-md-4 mb-4 d-flex" key={portafolio.idPortafolio}>
            <div
              className="card shadow-sm w-100"
              style={{ minHeight: "200px" }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">
                  <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                  {portafolio.NombrePortafolio}
                </h5>
                <p className="card-text flex-grow-1">
                  {portafolio.Descripcion}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => abrirModal(portafolio)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      confirmarEliminacion(portafolio.idPortafolio)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Eliminar
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() =>
                      navigate(
                        `/GestionProyectosPorPortafolio/${portafolio.idPortafolio}`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                    Más Detalle
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

export default GestionPortafoliosPorGerente;
