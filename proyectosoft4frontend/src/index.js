import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tus estilos locales
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Para medir el rendimiento de la aplicación
reportWebVitals();
