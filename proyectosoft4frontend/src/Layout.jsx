const Layout = ({ children, setView, userName, onLogout }) => {
  return (
    <div className="sb-nav-fixed">
      {/* Navbar Superior */}
      <nav className="sb-topnav navbar navbar-expand navbar-light bg-gradient">
        <a className="navbar-brand ps-3 text-primary fw-bold" href="#!">
          Notionday
        </a>
        <div className="d-flex ms-auto align-items-center">
          {/* Nombre del usuario */}
          <span className="me-3 text-primary fw-bold">{userName}</span>
          {/* Botón de Cerrar Sesión */}
          <button className="btn btn-primary me-3" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Layout Principal */}
      <div id="layoutSidenav">
        {/* Menú Lateral */}
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-light bg-light"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading text-primary">
                  Navegación
                </div>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("dashboard")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-tachometer-alt"></i>
                  </div>
                  Dashboard
                </button>

                <div className="sb-sidenav-menu-heading text-primary">
                  Seguridad
                </div>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("usuarios")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Usuarios
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("roles")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Roles
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("permisos")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Permisos
                </button>

                <div className="sb-sidenav-menu-heading text-primary">
                  Portafolio
                </div>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("portafolio")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Portafolio
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("equipos")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Equipos
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("proyectos")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Proyectos
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("miembrosEquipos")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Miembros de Equipos
                </button>

                <div className="sb-sidenav-menu-heading text-primary">
                  Tareas
                </div>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("tareas")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Tareas
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("subTareas")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Sub-Tareas
                </button>
                <div className="sb-sidenav-menu-heading text-primary">
                  Comentarios
                </div>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("comentariosProyectos")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Comentarios Proyectos
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("comentariosTareas")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Comentarios Tareas
                </button>
                <button
                  className="btn btn-link sb-nav-link"
                  onClick={() => setView("comentariosSubTareas")}
                >
                  <div className="sb-nav-link-icon text-primary">
                    <i className="fas fa-user"></i>
                  </div>
                  Comentarios Sub-Tareas
                </button>
              </div>
            </div>

            <div className="sb-sidenav-footer bg-gradient text-primary">
              <div className="small">Conectado como:</div>
              {userName}
            </div>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4 py-3">{children}</div>
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
