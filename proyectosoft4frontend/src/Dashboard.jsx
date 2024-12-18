import React from "react";
import "./CSS/Styles.css";

const DashboardMain = () => {
  return (
    <div className="dashboard-main">
      <div className="container py-5">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="display-4">Bienvenido a Notionday</h1>
          <p className="lead">
            Sistema gubernamental para la gestión integral de proyectos y
            tareas.
          </p>
        </header>

        {/* Cards Section */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Portafolios</h5>
                <p className="card-text">
                  Administra los portafolios de proyectos activos y
                  estratégicos.
                </p>
                <a href="/portafolio" className="btn btn-primary">
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
                  Visualiza y controla todos los proyectos asociados a los
                  portafolios.
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
                <h5 className="card-title">Tareas</h5>
                <p className="card-text">
                  Gestiona y asigna tareas dentro de cada proyecto.
                </p>
                <a href="/tareas" className="btn btn-warning">
                  Ver Tareas
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
                  <i className="bi bi-clipboard-data me-2"></i> Informes
                  Personalizados
                </h5>
                <p>
                  Genera informes detallados para la toma de decisiones
                  estratégicas.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-box">
                <h5>
                  <i className="bi bi-people-fill me-2"></i> Colaboración en
                  Equipos
                </h5>
                <p>
                  Coordina y supervisa los equipos de trabajo asignados a
                  proyectos.
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
