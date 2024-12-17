import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Reportes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faFolder,
  faFileAlt,
  faTasks,
  faFilter,
  faChartBar,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Reportes = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);

  const [reporteSeleccionado, setReporteSeleccionado] = useState("Proyectos");

  const [idUsuario, setIdUsuario] = useState("");
  const [idEquipo, setIdEquipo] = useState("");
  const [idPortafolio, setIdPortafolio] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [portafolios, setPortafolios] = useState([]);

  useEffect(() => {
    fetchUsuarios();
    fetchEquipos();
    fetchPortafolios();
  }, []);

  const fetchProyectos = async () => {
    setProyectos([]);
    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Proyectos`,
        {
          params: { idUsuario, idEquipo, idPortafolio },
        }
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
      setProyectos([]);
    }
  };

  const fetchTareas = async () => {
    setTareas([]);
    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Tareas`,
        {
          params: { idUsuario, idEquipo, idPortafolio },
        }
      );
      setTareas(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      setTareas([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiUsuarios/ListaUsuarios"
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchEquipos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiEquipos/ListaEquipos"
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  };

  const fetchPortafolios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5234/api/ApiPortafolio/ListaPortafolios"
      );
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error al obtener portafolios:", error);
    }
  };

  return (
    <div className="reporte-container">
      <h1 className="reporte-header text-primary d-flex align-items-center">
        <FontAwesomeIcon icon={faChartBar} className="me-2" />
        Reportes
      </h1>

      <div className="reporte-selector mb-4 d-flex gap-3">
        <button
          className={`btn ${
            reporteSeleccionado === "Proyectos"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setReporteSeleccionado("Proyectos")}
        >
          <FontAwesomeIcon icon={faFolder} className="me-2" />
          Reporte de Proyectos
        </button>
        <button
          className={`btn ${
            reporteSeleccionado === "Tareas"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setReporteSeleccionado("Tareas")}
        >
          <FontAwesomeIcon icon={faTasks} className="me-2" />
          Reporte de Tareas
        </button>
      </div>

      <div className="filters mb-4">
        {reporteSeleccionado === "Tareas" && (
          <div className="filter-group mb-3">
            <label className="me-2">
              <FontAwesomeIcon icon={faUser} className="me-1 text-secondary" />
              Usuario:
            </label>
            <select
              className="form-select"
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
            >
              <option value="">Seleccionar Usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.idUsuarios} value={usuario.idUsuarios}>
                  {usuario.Nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group mb-3">
          <label className="me-2">
            <FontAwesomeIcon icon={faUsers} className="me-1 text-secondary" />
            Equipo:
          </label>
          <select
            className="form-select"
            value={idEquipo}
            onChange={(e) => setIdEquipo(e.target.value)}
          >
            <option value="">Seleccionar Equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.idEquipos} value={equipo.idEquipos}>
                {equipo.NombreEquipos}
              </option>
            ))}
          </select>
        </div>

        {reporteSeleccionado === "Proyectos" && (
          <div className="filter-group mb-3">
            <label className="me-2">
              <FontAwesomeIcon
                icon={faFolder}
                className="me-1 text-secondary"
              />
              Portafolio:
            </label>
            <select
              className="form-select"
              value={idPortafolio}
              onChange={(e) => setIdPortafolio(e.target.value)}
            >
              <option value="">Seleccionar Portafolio</option>
              {portafolios.map((portafolio) => (
                <option
                  key={portafolio.idPortafolio}
                  value={portafolio.idPortafolio}
                >
                  {portafolio.NombrePortafolio}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {reporteSeleccionado === "Proyectos" && (
        <div>
          <button className="btn btn-success mb-3" onClick={fetchProyectos}>
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Filtrar Proyectos
          </button>
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Equipo</th>
                <th>Portafolio</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length > 0 ? (
                proyectos.map((proyecto) => (
                  <tr key={proyecto.idProyectos}>
                    <td>{proyecto.NombreProyecto}</td>
                    <td>{proyecto.Descripcion}</td>
                    <td>{proyecto.Estado}</td>
                    <td>{proyecto.Equipo}</td>
                    <td>{proyecto.Portafolio}</td>
                    <td>{proyecto.FechaInicio}</td>
                    <td>{proyecto.FechaFinal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {reporteSeleccionado === "Tareas" && (
        <div>
          <button className="btn btn-success mb-3" onClick={fetchTareas}>
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Filtrar Tareas
          </button>
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Proyecto</th>
                <th>Equipo</th>
                <th>Portafolio</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
              </tr>
            </thead>
            <tbody>
              {tareas.length > 0 ? (
                tareas.map((tarea) => (
                  <tr key={tarea.idTareas}>
                    <td>{tarea.NombreTareas}</td>
                    <td>{tarea.Descripcion}</td>
                    <td>{tarea.Proyecto}</td>
                    <td>{tarea.Equipo}</td>
                    <td>{tarea.Portafolio}</td>
                    <td>{tarea.FechaInicio}</td>
                    <td>{tarea.FechaFinal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reportes;
