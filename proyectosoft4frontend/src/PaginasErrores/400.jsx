import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Error.css";

const Error400 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-code">400</h1>
      <h2 className="error-message">Solicitud Incorrecta</h2>
      <p>
        Algo salió mal con tu solicitud. Por favor, verifica los datos enviados.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default Error400;
