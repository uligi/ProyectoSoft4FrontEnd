import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Reportes.css";

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
    // Limpiar los proyectos antes de la nueva búsqueda
    setProyectos([]);

    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Proyectos`,
        {
          params: {
            idUsuario,
            idEquipo,
            idPortafolio,
          },
        }
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
      setProyectos([]); // Asegurarse de que la tabla se vacíe si hay un error
    }
  };

  const fetchTareas = async () => {
    // Limpiar las tareas antes de la nueva búsqueda
    setTareas([]);

    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Tareas`,
        {
          params: {
            idUsuario,
            idEquipo,
            idPortafolio,
          },
        }
      );
      setTareas(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      setTareas([]); // Asegurarse de que la tabla se vacíe si hay un error
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
      <h1 className="reporte-header">Reportes</h1>

      <div className="reporte-selector">
        <button
          className={`btn ${
            reporteSeleccionado === "Proyectos"
              ? "btn-primary"
              : "btn-secondary"
          }`}
          onClick={() => setReporteSeleccionado("Proyectos")}
        >
          Reporte de Proyectos
        </button>
        <button
          className={`btn ${
            reporteSeleccionado === "Tareas" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setReporteSeleccionado("Tareas")}
        >
          Reporte de Tareas
        </button>
      </div>

      <div>
        <label>Usuario:</label>
        <select
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

        <label>Equipo:</label>
        <select value={idEquipo} onChange={(e) => setIdEquipo(e.target.value)}>
          <option value="">Seleccionar Equipo</option>
          {equipos.map((equipo) => (
            <option key={equipo.idEquipos} value={equipo.idEquipos}>
              {equipo.NombreEquipos}
            </option>
          ))}
        </select>

        <label>Portafolio:</label>
        <select
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

      {reporteSeleccionado === "Proyectos" && (
        <div>
          <button className="btn btn-success" onClick={fetchProyectos}>
            Filtrar Proyectos
          </button>
          <table className="reporte-table">
            <thead>
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
                  <td colSpan="7" style={{ textAlign: "center" }}>
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
          <button className="btn btn-success" onClick={fetchTareas}>
            Filtrar Tareas
          </button>
          <table className="reporte-table">
            <thead>
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
                  <td colSpan="6" style={{ textAlign: "center" }}>
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
