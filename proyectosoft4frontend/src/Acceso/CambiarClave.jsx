import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/login.css";

const CambiarClave = () => {
  const location = useLocation();
  const { userId } = location.state || {};

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  if (!userId) {
    return <p>Error: Usuario no especificado.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esContrasenaValida = (password) => {
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };

    if (!esContrasenaValida(nuevaContrasena)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un carácter especial y un número."
      );
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post("http://localhost:5234/api/Auth/CambiarClave", {
        IdUsuario: userId,
        NuevaContrasena: nuevaContrasena,
        ConfirmarContrasena: confirmarContrasena,
      });

      setSuccess("Contraseña cambiada correctamente.");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirigir después de 2 segundos
    } catch (err) {
      setError("Ocurrió un error al cambiar la contraseña.");
    }
  };

  return (
    <div className="login-container">
      <h1>Cambiar Contraseña</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            placeholder="Confirma tu nueva contraseña"
          />
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default CambiarClave;
