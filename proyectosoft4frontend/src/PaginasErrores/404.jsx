import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Error.css";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Página No Encontrada</h2>
      <p>La página que buscas no existe o fue movida.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default Error404;
