import React from "react";
import "./CSS/layout.css";
import { useNavigate, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserShield,
  faProjectDiagram,
  faTasks,
  faChartBar,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import usePermisos from "./hooks/Permisos";

const Layout = ({ userName, onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Obtiene el usuario del localStorage
  const { permisos, error } = usePermisos(user?.idUsuarios);
  const navigate = useNavigate(); // Inicializa navigate

  if (error) {
    return <p>{error}</p>;
  }

  const renderSubMenu = (title, links, icon) => (
    <div>
      <button
        className="btn btn-link sb-nav-link"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#submenu-${title}`}
        aria-expanded="false"
        aria-controls={`submenu-${title}`}
      >
        <FontAwesomeIcon icon={icon} className="me-2" />
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
      <nav className="sb-topnav navbar navbar-expand navbar-light bg-primary">
        <a className="navbar-brand ps-3 text-white fw-bold" href="#!">
          Notionday
        </a>
        <div className="d-flex ms-auto align-items-center">
          <span className="me-3 text-white fw-bold">{userName}</span>
          <button className="btn btn-light me-3" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Layout Principal */}
      <div id="layoutSidenav">
        {/* Menú Lateral */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark bg-dark">
            <div className="sb-sidenav-menu">
              <div className="nav">
                {permisos === "Nivel 1" && (
                  <>
                    <div className="sb-sidenav-menu-heading text-white">
                      Navegación
                    </div>
                    <button
                      className="btn btn-link sb-nav-link text-white"
                      onClick={() => navigate("/dashboard")}
                    >
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Inicio
                    </button>
                    <div className="sb-sidenav-menu-heading text-white">
                      Seguridad
                    </div>
                    {renderSubMenu(
                      "Seguridad",
                      [
                        { label: "Usuarios", path: "/usuarios" },
                        { label: "Roles", path: "/roles" },
                        { label: "Permisos", path: "/permisos" },
                      ],
                      faUserShield
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Portafolio
                    </div>
                    {renderSubMenu(
                      "Portafolio",
                      [
                        { label: "Portafolio", path: "/portafolio" },
                        { label: "Equipos", path: "/equipos" },
                        { label: "Proyectos", path: "/proyectos" },
                        {
                          label: "Miembros de Equipos",
                          path: "/miembrosEquipos",
                        },
                      ],
                      faProjectDiagram
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Tareas
                    </div>
                    {renderSubMenu(
                      "Tareas",
                      [{ label: "Tareas", path: "/tareas" }],
                      faTasks
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Sub-Tareas
                    </div>
                    {renderSubMenu(
                      "Subtareas",
                      [{ label: "Subtareas", path: "/Subtareas" }],
                      faTasks
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Reportes
                    </div>
                  </>
                )}
                {permisos === "Nivel 2" ? (
                  <>
                    <div className="sb-sidenav-menu-heading text-white">
                      Navegación
                    </div>
                    <button
                      className="btn btn-link sb-nav-link text-white"
                      onClick={() => navigate("/dashboard")}
                    >
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Inicio
                    </button>
                    <div className="sb-sidenav-menu-heading text-white">
                      Portafolio
                    </div>
                    {renderSubMenu(
                      "Portafolio",
                      [
                        {
                          label: "+ Portafolio",
                          path: "/GestionPortafoliosPorGerente",
                        },
                        {
                          label: "+ Equipos",
                          path: "/GestionEquiposPorGerente",
                        },
                        {
                          label: "+ Miembros de equipos",
                          path: "/GestionMiembrosdeEquiposPorGerente",
                        },
                        {
                          label: "+ Proyectos",
                          path: "/GestionProyectosPorGerente",
                        },
                      ],
                      faProjectDiagram
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Tareas
                    </div>
                    {renderSubMenu(
                      "Tareas",
                      [{ label: "Tareas", path: "/tareas" }],
                      faTasks
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Reportes
                    </div>
                    <button
                      className="btn btn-link sb-nav-link text-white"
                      onClick={() => navigate("/reportes")}
                    >
                      <FontAwesomeIcon icon={faChartBar} className="me-2" />
                      Reportes
                    </button>
                  </>
                ) : null}
                {permisos === "Nivel 3" ? (
                  <>
                    <div className="sb-sidenav-menu-heading text-white">
                      Proyectos
                    </div>
                    {renderSubMenu(
                      "Proyectos",
                      [
                        {
                          label: "Mis Proyectos",
                          path: "/GestionProyectosPorUsuarios",
                        },
                      ],
                      faProjectDiagram
                    )}
                    <div className="sb-sidenav-menu-heading text-white">
                      Tareas
                    </div>
                    {renderSubMenu(
                      "Tareas",
                      [
                        {
                          label: "Mis Tareas",
                          path: "/GestionTareasPorUsuarios",
                        },
                      ],
                      faTasks
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4 py-3">
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">
                  Copyright &copy; Notionday 2024
                </div>
                <div>
                  <a href="./Politicas/Politicas.jsx">Política de Privacidad</a>
                  &middot;
                  <a href="./Politicas/Terminos.jsx">Términos y Condiciones</a>
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
