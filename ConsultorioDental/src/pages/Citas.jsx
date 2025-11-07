import React, { useState, useEffect } from 'react';
import './Citas.css';
import Header from './Header';
import axios from 'axios';


export default function Citas() {
  const PRIORIDAD_NORMAL = 1;
  const PRIORIDAD_URGENTE = 2;
  const PRIORIDAD_EMERGENCIA = 3;
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    IDPaciente: '', 
    Fecha: '',      
    Hora: '',
    Motivo: '',
    Notas: '',
    Prioridad: PRIORIDAD_NORMAL,
  });
  const [error, setError] = useState(null);
  
  // Cargar la lista de citas
  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/citasCompletas");
      setCitas(response.data); 
    } catch (err) {
      console.error('Error al cargar las citas:', err);
      setError('Error al cargar las citas. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar la lista de pacientes para el select
  const fetchPacientes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/pacientes");
      setPacientes(response.data);
    } catch (err) {
      console.error('Error al cargar la lista de pacientes:', err);
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchPacientes();
  }, []);
  
  const filtroANumero = (texto) => {
    switch (texto) {
        case 'Programadas':
            return 1;
        case 'Completadas':
            return 2;
        case 'Canceladas':
            return 3;
        case 'Todas las citas': 
        default:
            return null;
    }
}

  const [filtro, setFiltro] = useState('Todas las citas');
  const estadoFiltroNumero = filtroANumero(filtro);
  const citasFiltradas = estadoFiltroNumero !== null
      ? citas.filter(c => c.Estado === estadoFiltroNumero)
      : citas;


  const programadasCitas = citas.filter(c => c.Estado === 1).length;
  const completadasCitas = citas.filter(c => c.Estado === 2).length;
  const canceladasCitas = citas.filter(c => c.Estado === 3).length;


  const handleFormChange = e => {
    const { name, value } = e.target;
    // Si el campo es 'Prioridad', convertimos el valor a entero
    const newValue = name === 'Prioridad' ? parseInt(value, 10) : value;
    setForm(prevForm => ({ ...prevForm, [name]: newValue }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    
    const nuevaCita = {
      IDPaciente: form.IDPaciente,
      Fecha: form.Fecha,
      Hora: form.Hora,
      Motivo: form.Motivo,
      Notas: form.Notas,
      Prioridad: form.Prioridad,
    };

    try {
      await axios.post("http://localhost:4000/api/citasCrear", nuevaCita);

      // Limpiar el formulario y cerrar el modal
      setForm({
        IDPaciente: '',
        Fecha: '',
        Hora: '',
        Motivo: '',
        Notas: '',
        Prioridad: PRIORIDAD_NORMAL
      });
      setShowForm(false);
      fetchCitas();

    } catch (err) {
      console.error('Error al programar la cita:', err);
      alert('Hubo un error al programar la cita. Verifique los datos.');
    }
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    if (isNaN(date.getTime())) return dateStr; 

    const dayName = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const getEstadoText = (estadoCode) => {
    switch (estadoCode) {
        case 1:
            return 'Programada';
        case 2:
            return 'Completada';
        case 3:
            return 'Cancelada';
        default:
            return 'Desconocido'; 
    }
};

const getEstadoClass = (estadoCode) => {
    switch (estadoCode) {
        case 1:
            return 'programada';
        case 2:
            return 'completada';
        case 3:
            return 'cancelada';
        default:
            return 'programada'; 
    }
};

const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    
    const [hours, minutes] = timeStr.split(':'); 
    
    if (hours === undefined || minutes === undefined) return timeStr;

    let hour = parseInt(hours, 10);
    const min = minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    // Conversión a formato de 12 horas
    hour = hour % 12;
    hour = hour ? hour : 12;
    
    return `${hour}:${min} ${ampm}`;
};

  return (
    <div className="citas-container">
      <Header />
      <main className="citas-main">
        <div className="citas-header">
          <div className="citas-title-section">
            <h1 className="citas-title">Gestión de Citas</h1>
            <p className="citas-subtitle">Administra todas las citas médicas</p>
          </div>
          <div className="citas-header-buttons">
            <button 
              className="citas-nueva-cita"
              onClick={() => {
                setShowForm(true);
                // Lista de Pacientes
                if (pacientes.length === 0) fetchPacientes();
              }}
            >
              + Nueva Cita
            </button>
          </div>
        </div>
        
        <div className="citas-stats-container">
          <div className="citas-stat-card programadas">
            <div className="citas-stat-number">{programadasCitas}</div>
            <div className="citas-stat-label">PROGRAMADAS</div>
          </div>
          <div className="citas-stat-card completadas">
            <div className="citas-stat-number">{completadasCitas}</div>
            <div className="citas-stat-label">COMPLETADAS</div>
          </div>
          <div className="citas-stat-card canceladas">
            <div className="citas-stat-number">{canceladasCitas}</div>
            <div className="citas-stat-label">CANCELADAS</div>
          </div>
        </div>

        {/* ... (Sección de Filtro se mantiene) ... */}
        <div className="citas-filter-section">
          <span className="citas-filter-label">Filtrar por estado:</span>
          <select 
            className="citas-select"
            value={filtro} 
            onChange={e => setFiltro(e.target.value)}
          >
            <option>Todas las citas</option>
            <option>Programadas</option>
            <option>Completadas</option>
            <option>Canceladas</option>
          </select>
        </div>

        <div className="citas-list-title">
          Lista de Citas ({citasFiltradas.length})
        </div>

        {/* --- Citas --- */}
        <div className="citas-cards-container">
          {error && <div className="citas-error-message">{error}</div>}
          {loading ? (
            <div className="citas-loading">Cargando citas...</div>
          ) : citasFiltradas.length === 0 ? (
            <div className="citas-empty">No hay citas registradas para este filtro.</div>
          ) : (
            citasFiltradas.map(cita => (
              <div 
                  key={cita.ID} 
                  className={`citas-card ${getEstadoClass(cita.Estado)}`} 
              >
                <div className="citas-card-header">
                  <span className="citas-patient-name">{cita.Paciente || `ID: ${cita.IDPaciente}`}</span>
                  <span 
                      className={`citas-status-badge ${getEstadoClass(cita.Estado)}`}
                  >
                      {getEstadoText(cita.Estado)}
                  </span>
                </div>
                <div className="citas-card-content">
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(cita.Fecha)}</span>
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(cita.Hora)}</span>  
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{cita.Celular || 'N/A'}</span>
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{cita.Correo || 'N/A'}</span>
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{cita.Motivo}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Modal de Nueva Cita --- */}
        {showForm && (
          <div className="citas-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <div className="citas-modal-form">
              <div className="citas-modal-header">
                <h2 className="citas-modal-title">
                  <svg className="citas-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Programar Nueva Cita Médica
                </h2>
                <button 
                  className="citas-modal-close"
                  onClick={() => setShowForm(false)}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <div className="citas-form-grid">
                  
                  {/* --- CAMPO PACIENTE (SELECT) --- */}
                  <div className="citas-form-group full-width">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Paciente *
                    </label>
                    <select 
                      className="citas-form-input"
                      name="IDPaciente"
                      value={form.IDPaciente} 
                      onChange={handleFormChange} 
                      required 
                    >
                      <option value="">Seleccione un paciente</option>
                      {pacientes.map(p => (
                        <option key={p.ID} value={p.ID}>
                          {p.Nombre || p.Paciente}
                        </option>
                      ))}
                    </select>
                    {pacientes.length === 0 && (
                        <small className="citas-form-helper">Cargando lista de pacientes...</small>
                    )}
                  </div>
                  
                  <div className="citas-form-group">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Fecha de la Cita *
                    </label>
                    <input 
                      className="citas-form-input"
                      type="date" 
                      name="Fecha" 
                      value={form.Fecha} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>

                  <div className="citas-form-group">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hora de la Cita *
                    </label>
                    <input 
                      className="citas-form-input"
                      type="time" 
                      name="Hora" 
                      value={form.Hora} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>                  

                  <div className="citas-form-group full-width">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Motivo de la Consulta *
                    </label>
                    <select 
                      className="citas-form-input"
                      name="Motivo" 
                      value={form.Motivo} 
                      onChange={handleFormChange}
                      required 
                    >
                      <option value="">Seleccionar tipo de consulta</option>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Revisión médica">Revisión médica</option>
                      <option value="Seguimiento">Seguimiento</option>
                      <option value="Urgencia">Urgencia</option>
                      <option value="Consulta especializada">Consulta especializada</option>
                      <option value="Chequeo preventivo">Chequeo preventivo</option>
                      <option value="Resultados de estudios">Resultados de estudios</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="citas-form-group full-width">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Notas Adicionales
                    </label>
                    <textarea 
                      className="citas-form-textarea"
                      name="Notas" 
                      value={form.Notas} 
                      onChange={handleFormChange} 
                      placeholder="Información adicional: síntomas, medicamentos actuales, alergias, etc."
                      rows="4" 
                    />
                  </div>

                  <div className="citas-priority-section full-width">
                    <label className="citas-form-label">
                      <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Prioridad de la Cita
                    </label>
                    <div className="citas-priority-options">
                      <label className="citas-radio-option">
                        <input 
                          type="radio" 
                          name="Prioridad" 
                          value={PRIORIDAD_NORMAL} 
                          checked={form.Prioridad === PRIORIDAD_NORMAL}
                          onChange={handleFormChange}
                        />
                        <span className="citas-radio-label normal">Normal</span>
                      </label>
                      <label className="citas-radio-option">
                        <input 
                          type="radio" 
                          name="Prioridad" 
                          value={PRIORIDAD_URGENTE} 
                          checked={form.Prioridad === PRIORIDAD_URGENTE}
                          onChange={handleFormChange}
                        />
                        <span className="citas-radio-label urgente">Urgente</span>
                      </label>
                      <label className="citas-radio-option">
                        <input 
                          type="radio" 
                          name="Prioridad" 
                          value={PRIORIDAD_EMERGENCIA} 
                          checked={form.Prioridad === PRIORIDAD_EMERGENCIA}
                          onChange={handleFormChange}
                        />
                        <span className="citas-radio-label emergencia">Emergencia</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="citas-form-buttons">
                  <button 
                    type="button" 
                    className="citas-cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="citas-save-button"
                    disabled={loading || !form.IDPaciente} 
                  >
                    <svg className="citas-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Programar Cita
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}