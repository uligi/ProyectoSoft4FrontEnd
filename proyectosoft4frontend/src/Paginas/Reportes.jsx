import React, { useState } from "react";
import axios from "axios";
import "../CSS/Reportes.css";

const Reportes = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);

  const [fechaInicio, setFechaInicio] = useState("");
  const [estado, setEstado] = useState("");

  const [idUsuario, setIdUsuario] = useState("");
  const [prioridad, setPrioridad] = useState("");

  const fetchProyectos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Proyectos?fechaInicio=${fechaInicio}&estado=${estado}`
      );
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
    }
  };

  const fetchTareas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5234/api/Reportes/Tareas?idUsuario=${idUsuario}&prioridad=${prioridad}`
      );
      setTareas(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  return (
    <div className="reporte-container">
      <h1 className="reporte-header">Reportes</h1>

      {/* Reporte de Tareas */}
      <div>
        <h2 className="reporte-header">Reporte de Tareas</h2>
        <div className="reporte-filtro">
          <label>ID Usuario:</label>
          <input
            type="number"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
          />
        </div>
        <div className="reporte-filtro">
          <label>Prioridad:</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="">Seleccionar Prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <button onClick={fetchTareas}>Filtrar Tareas</button>
        <table className="reporte-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Fecha Inicio</th>
              <th>Fecha Final</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => (
              <tr key={tarea.idTareas}>
                <td>{tarea.NombreTareas}</td>
                <td>{tarea.Descripcion}</td>
                <td>{tarea.Prioridad}</td>
                <td>{tarea.FechaInicio}</td>
                <td>{tarea.FechaFinal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
