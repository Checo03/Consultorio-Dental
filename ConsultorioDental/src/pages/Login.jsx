import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from './Header';
import Citas from './Citas';

export default function Login(){
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías validar usuario/contraseña si lo deseas
        navigate('/citas');
    };

    return(
        <div>
            <Header />
            <div className="login-bg">
                <div className="login-card">
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'1.2rem', zIndex:1}}>
                        <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt="avatar" style={{width:'64px', height:'64px', borderRadius:'50%', boxShadow:'0 2px 8px rgba(60,80,120,0.10)', marginBottom:'0.7rem', background:'#e3eafc'}} />
                        <h2 className="login-title">Iniciar sesión</h2>
                        <span style={{color:'#4a90e2', fontWeight:500, fontSize:'1rem', letterSpacing:'0.5px'}}>Bienvenido de nuevo</span>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <input type="text" id="username" name="username" placeholder="Ingresa tu usuario" autoComplete="username" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" />
                        </div>
                        <button type="submit" className="login-btn">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}