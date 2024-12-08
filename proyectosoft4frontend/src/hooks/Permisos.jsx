import { useEffect, useState } from "react";
import axios from "axios";

const usePermisos = (idUsuario) => {
  const [permisos, setPermisos] = useState(null); // Cambiar a null por defecto
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5234/api/Auth/ObtenerPermisos?idUsuario=${idUsuario}`
        );
        // Asegurarse de que los permisos están definidos
        setPermisos(response.data.Permisos || null);
      } catch (err) {
        setError("Error al obtener los permisos.");
      }
    };

    if (idUsuario) {
      fetchPermisos();
    }
  }, [idUsuario]);

  return { permisos, error };
};

export default usePermisos;
