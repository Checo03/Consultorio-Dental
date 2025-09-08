
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Pacientes from "./Pacientes";
import Citas from "./Citas";
import './Header.css';


export default function Header() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo y título */}
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                            <path d="M12 8v4l3 3"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <div className="logo-text">
                        <h1 className="header-title">Consultorio</h1>
                        <p className="header-subtitle">Sistema de Gestión</p>
                    </div>
                </Link>

                {/* Navegación principal */}
                <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <Link 
                        to="/" 
                        className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                        <span>Inicio</span>
                    </Link>
                    
                    <Link 
                        to="/pacientes" 
                        className={`nav-link ${isActive('/pacientes') ? 'nav-link-active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>Pacientes</span>
                    </Link>
                    
                    <Link 
                        to="/citas" 
                        className={`nav-link ${isActive('/citas') ? 'nav-link-active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>Citas</span>
                    </Link>
                </nav>

                {/* Sección de usuario */}
                <div className="header-user">
                    
                    <div className="user-profile">
                        <div className="user-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div className="user-info">
                            <span className="user-name">Dr. Juan Pérez</span>
                            <span className="user-role">Dentista</span>
                        </div>
                        <div className="user-dropdown">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Botón de menú móvil */}
                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
            </div>

            {/* Overlay para cerrar menú móvil */}
            {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>}
        </header>
    );
}