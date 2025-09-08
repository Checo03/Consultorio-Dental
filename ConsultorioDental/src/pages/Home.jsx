import './Home.css';
import Header from './Header';

export default function Home() {
    return (
        <div className="main-bg">
            <Header />
            <div className="center-card enhanced-card">
                <div className="icon-circle">
                    <span role="img" aria-label="dental" className="dental-icon">🦷</span>
                </div>
                <h2 className="title">Bienvenido al Consultorio Dental</h2>
                <p className="desc">Administra pacientes, citas y servicios con una plataforma moderna y segura.</p>
                <ul className="features-list">
                    <li>✔ Gestión de pacientes y expedientes</li>
                    <li>✔ Control de citas y agenda</li>
                    <li>✔ Reportes y estadísticas</li>
                </ul>
                <button className="login-btn" onClick={() => window.location.href = '/login'}>
                    Iniciar sesión
                </button>
            </div>
        </div>
    );
}