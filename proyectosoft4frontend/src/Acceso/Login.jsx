import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5234/api/Auth/Login",
        { email, password }
      );

      localStorage.setItem("token", response.data.Token);
      localStorage.setItem("user", JSON.stringify(response.data.User));
      setUser(response.data.User); // Actualizar el estado del usuario

      if (response.data.User.RestablecerContrasena) {
        navigate("/cambiar-clave", {
          state: { userId: response.data.User.idUsuarios },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu email"
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
