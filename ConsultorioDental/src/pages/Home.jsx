import React from 'react';
import './Home.css';
import Header from './Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="hero-container">
        <div className="professional-card">
          
          {/* Icono principal */}
          <div className="icon-wrapper">
            <svg className="dental-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="url(#gradient1)"/>
              <path d="M35 40c0-8 5-12 15-12s15 4 15 12v20c0 8-5 12-15 12s-15-4-15-12V40z" fill="white"/>
              <circle cx="42" cy="48" r="3" fill="#0066CC"/>
              <circle cx="58" cy="48" r="3" fill="#0066CC"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0066CC"/>
                  <stop offset="100%" stopColor="#00A3E0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Contenido principal */}
          <div className="content-section">
            <h1 className="main-title">Sistema de Gestión Dental</h1>
            <p className="main-description">
              Plataforma integral para la administración eficiente de consultorios dentales modernos
            </p>
          </div>

          {/* Botón de acción */}
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/login'}
          >
            <span className="button-text">Acceder al Sistema</span>
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Indicadores de características */}
          <div className="features-indicators">
            <div className="feature-dot"></div>
            <div className="feature-dot active"></div>
            <div className="feature-dot"></div>
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
        <div className="bg-decoration decoration-1"></div>
        <div className="bg-decoration decoration-2"></div>
        <div className="bg-decoration decoration-3"></div>
      </div>
    </>
  );
}