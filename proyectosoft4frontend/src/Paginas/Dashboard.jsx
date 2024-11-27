import React from "react";
import "../CSS/Styles.css";

const DashboardMain = () => {
  return (
    <div className="dashboard-main">
      <div className="container py-5">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="display-4">Bienvenido al Dashboard</h1>
          <p className="lead">
            Gestiona tus portafolios, proyectos, subtareas y mucho más desde un
            único lugar.
          </p>
        </header>

        {/* Cards Section */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Portafolios</h5>
                <p className="card-text">
                  Visualiza y administra los portafolios activos.
                </p>
                <a href="/portafolios" className="btn btn-primary">
                  Ver Portafolios
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Proyectos</h5>
                <p className="card-text">
                  Explora todos los proyectos dentro de tus portafolios.
                </p>
                <a href="/proyectos" className="btn btn-success">
                  Ver Proyectos
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Tablero Kanban</h5>
                <p className="card-text">
                  Organiza tus subtareas por prioridad en un tablero visual.
                </p>
                <a href="/kanban" className="btn btn-warning">
                  Ir al Tablero Kanban
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-5">
          <h3 className="text-center">Características Destacadas</h3>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="feature-box">
                <h5>
                  <i className="bi bi-bar-chart-line-fill me-2"></i> Análisis en
                  Tiempo Real
                </h5>
                <p>
                  Obtén informes detallados de tus proyectos y subtareas para
                  tomar decisiones rápidas.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-box">
                <h5>
                  <i className="bi bi-people-fill me-2"></i> Gestión de Equipos
                </h5>
                <p>
                  Administra los equipos asignados a cada portafolio y proyecto.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardMain;
