import { useEffect, useState } from "react";
import axios from "axios";

const usePermisos = (idUsuario) => {
  const [permisos, setPermisos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5234/api/Auth/ObtenerPermisos?idUsuario=${idUsuario}`
        );
        // Asume que "Permisos" es un string y conviértelo en un array.
        const permisosObtenidos = [response.data.Permisos];
        setPermisos(permisosObtenidos);
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
