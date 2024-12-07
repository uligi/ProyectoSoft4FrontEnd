import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import usePermisos from "./hooks/Permisos";

const Layout = ({ userName, onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Obtiene el usuario del localStorage
  const { permisos, error } = usePermisos(user?.idUsuarios);
  const navigate = useNavigate(); // Inicializa navigate

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="sb-nav-fixed">
      {/* Navbar Superior */}
      <nav className="sb-topnav navbar navbar-expand navbar-light bg-gradient">
        <a className="navbar-brand ps-3 text-primary fw-bold" href="#!">
          Notionday
        </a>
        <div className="d-flex ms-auto align-items-center">
          <span className="me-3 text-primary fw-bold">{userName}</span>
          <button className="btn btn-primary me-3" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Layout Principal */}
      <div id="layoutSidenav">
        {/* Menú Lateral */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-light bg-light">
            <div className="sb-sidenav-menu">
              <div className="nav">
                {/* Nivel 1: Todos los permisos */}
                {permisos === "Nivel 1" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Navegación
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </button>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Seguridad
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/usuarios")}
                    >
                      Usuarios
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/roles")}
                    >
                      Roles
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/permisos")}
                    >
                      Permisos
                    </button>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Portafolio
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/portafolio")}
                    >
                      Portafolio
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/equipos")}
                    >
                      Equipos
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/proyectos")}
                    >
                      Proyectos
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/tareas")}
                    >
                      Tareas
                    </button>
                  </>
                )}

                {/* Nivel 2: No puede ver seguridad */}
                {permisos === "Nivel 2" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Navegación
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </button>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Portafolio
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/portafolio")}
                    >
                      Portafolio
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/equipos")}
                    >
                      Equipos
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/proyectos")}
                    >
                      Proyectos
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/tareas")}
                    >
                      Tareas
                    </button>
                  </>
                )}

                {/* Nivel 3: Solo puede ver Proyectos y Tareas */}
                {permisos === "Nivel 3" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Proyectos y Tareas
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/proyectos")}
                    >
                      Proyectos
                    </button>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/tareas")}
                    >
                      Tareas
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4 py-3">
              {/* Renderizar subrutas aquí */}
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">
                  Copyright &copy; Notionday 2023
                </div>
                <div>
                  <a href="#!">Política de Privacidad</a>
                  &middot;
                  <a href="#!">Términos y Condiciones</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
