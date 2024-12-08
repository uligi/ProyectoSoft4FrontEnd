import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Error.css";

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-code">500</h1>
      <h2 className="error-message">Error del Servidor</h2>
      <p>
        Algo salió mal en el servidor. Por favor, intenta nuevamente más tarde.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default Error500;
