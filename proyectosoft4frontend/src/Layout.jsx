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

  const renderSubMenu = (title, links) => (
    <div>
      <button
        className="btn btn-link sb-nav-link"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#submenu-${title}`}
        aria-expanded="false"
        aria-controls={`submenu-${title}`}
      >
        {title}
      </button>
      <div className="collapse" id={`submenu-${title}`}>
        <ul className="sb-sidenav-menu-nested nav">
          {links.map((link) => (
            <li key={link.label}>
              <button
                className="btn btn-link sb-nav-link"
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

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
                {permisos === "Nivel 1" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Navegación
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/dashboard")}
                    >
                      Inicio
                    </button>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Seguridad
                    </div>
                    {renderSubMenu("Seguridad", [
                      { label: "Usuarios", path: "/usuarios" },
                      { label: "Roles", path: "/roles" },
                      { label: "Permisos", path: "/permisos" },
                    ])}
                    <div className="sb-sidenav-menu-heading text-primary">
                      Portafolio
                    </div>
                    {renderSubMenu("Portafolio", [
                      { label: "Portafolio", path: "/portafolio" },
                      { label: "Equipos", path: "/equipos" },
                      { label: "Proyectos", path: "/proyectos" },
                      {
                        label: "Comentarios de Proyectos",
                        path: "/comentariosProyectos",
                      },
                    ])}
                    <div className="sb-sidenav-menu-heading text-primary">
                      Tareas
                    </div>
                    {renderSubMenu("Tareas", [
                      { label: "Tareas", path: "/tareas" },
                      {
                        label: "Comentarios de Tareas",
                        path: "/comentariosTareas",
                      },
                    ])}
                    {renderSubMenu("Sub-Tareas", [
                      { label: "Sub-Tareas", path: "/subTareas" },
                      {
                        label: "Comentarios de Sub-Tareas",
                        path: "/comentariosSubtareas",
                      },
                    ])}
                    <div className="sb-sidenav-menu-heading text-primary">
                      Reportes
                    </div>
                    <button
                      className="btn btn-link sb-nav-link"
                      onClick={() => navigate("/reportes")}
                    >
                      Reportes
                    </button>
                  </>
                )}
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
                    {renderSubMenu("Portafolio", [
                      { label: "Portafolio", path: "/portafolio" },
                      { label: "Equipos", path: "/equipos" },
                      { label: "Proyectos", path: "/proyectos" },
                    ])}
                  </>
                )}
                {permisos === "Nivel 3" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-primary">
                      Proyectos y Tareas
                    </div>
                    {renderSubMenu("Proyectos", [
                      { label: "Proyectos", path: "/proyectos" },
                      {
                        label: "Comentarios de Proyectos",
                        path: "/comentariosProyectos",
                      },
                    ])}
                    {renderSubMenu("Tareas", [
                      { label: "Tareas", path: "/tareas" },
                      {
                        label: "Comentarios de Tareas",
                        path: "/comentariosTareas",
                      },
                    ])}
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
