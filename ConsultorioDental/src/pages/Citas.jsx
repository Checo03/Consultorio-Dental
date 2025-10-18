import React, { useState, useEffect } from 'react';
import './Citas.css';
import Header from './Header';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    paciente: '',
    fecha: '',
    hora: '',
    telefono: '',
    email: '',
    motivo: '',
    notas: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setCitas([
        { ID: 1, Estado: 'PROGRAMADA', Paciente: 'María González', Fecha: '2024-01-14', Hora: '10:00', Telefono: '+52 449 123 4567', Email: 'maria@example.com', Motivo: 'Consulta general' },
        { ID: 2, Estado: 'COMPLETADA', Paciente: 'Juan Pérez', Fecha: '2024-01-14', Hora: '14:30', Telefono: '+52 449 987 6543', Email: 'juan@example.com', Motivo: 'Revisión médica' },
        { ID: 3, Estado: 'PROGRAMADA', Paciente: 'Ana Rodríguez', Fecha: '2024-01-15', Hora: '09:15', Telefono: '+52 449 555 0123', Email: 'ana@example.com', Motivo: 'Seguimiento' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const [filtro, setFiltro] = useState('Todas las citas');
  const citasFiltradas = filtro === 'Todas las citas'
    ? citas
    : citas.filter(c => c.Estado === filtro.toUpperCase());

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFormSubmit = e => { 
    e.preventDefault(); 
    setShowForm(false); 
  };

  const programadasCitas = citas.filter(c => c.Estado === 'PROGRAMADA').length;
  const completadasCitas = citas.filter(c => c.Estado === 'COMPLETADA').length;
  const canceladasCitas = citas.filter(c => c.Estado === 'CANCELADA').length;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
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
              className="citas-calendario-btn"
              onClick={() => window.location.href = '/calendario'}
            >
              <svg className="citas-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ver Calendario
            </button>
            <button 
              className="citas-nueva-cita"
              onClick={() => setShowForm(true)}
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
            <div className="citas-stat-number">1</div>
            <div className="citas-stat-label">CANCELADAS</div>
          </div>
          <div className="citas-stat-card neutral">
            <div className="citas-stat-number">0</div>
            <div className="citas-stat-label">CANCELADAS</div>
          </div>
        </div>

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

        <div className="citas-cards-container">
          {loading ? (
            <div className="citas-loading">Cargando citas...</div>
          ) : citasFiltradas.length === 0 ? (
            <div className="citas-empty">No hay citas registradas.</div>
          ) : (
            citasFiltradas.map(cita => (
              <div key={cita.ID} className={`citas-card ${cita.Estado.toLowerCase()}`}>
                <div className="citas-card-header">
                  <span className="citas-patient-name">{cita.Paciente}</span>
                  <span className={`citas-status-badge ${cita.Estado.toLowerCase()}`}>
                    {cita.Estado}
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
                    <span>{cita.Hora}</span>
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{cita.Telefono}</span>
                  </div>
                  <div className="citas-info-row">
                    <svg className="citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{cita.Email}</span>
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

        {showForm && (
  <div className="citas-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
    <div className="citas-modal-form">
      <div className="citas-modal-header">
        <h2 className="citas-modal-title">
          <svg className="citas-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Nueva Cita Médica
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
          <div className="citas-form-group full-width">
            <label className="citas-form-label">
              <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nombre del Paciente *
            </label>
            <input 
              className="citas-form-input"
              type="text" 
              name="paciente" 
              value={form.paciente} 
              onChange={handleFormChange} 
              required 
              placeholder="Ingrese el nombre completo del paciente" 
            />
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
              name="fecha" 
              value={form.fecha} 
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
              name="hora" 
              value={form.hora} 
              onChange={handleFormChange} 
              required 
            />
          </div>

          <div className="citas-form-group">
            <label className="citas-form-label">
              <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Teléfono de Contacto
            </label>
            <input 
              className="citas-form-input"
              type="tel" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleFormChange} 
              placeholder="Ej. +52 449 123 4567" 
            />
          </div>

          <div className="citas-form-group">
            <label className="citas-form-label">
              <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Correo Electrónico
            </label>
            <input 
              className="citas-form-input"
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleFormChange} 
              placeholder="paciente@correo.com" 
            />
          </div>

          <div className="citas-form-group full-width">
            <label className="citas-form-label">
              <svg className="citas-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Motivo de la Consulta
            </label>
            <select 
              className="citas-form-input"
              name="motivo" 
              value={form.motivo} 
              onChange={handleFormChange}
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
              name="notas" 
              value={form.notas} 
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
                  name="prioridad" 
                  value="normal" 
                  checked={form.prioridad === 'normal' || !form.prioridad}
                  onChange={handleFormChange}
                />
                <span className="citas-radio-label normal">Normal</span>
              </label>
              <label className="citas-radio-option">
                <input 
                  type="radio" 
                  name="prioridad" 
                  value="urgente" 
                  checked={form.prioridad === 'urgente'}
                  onChange={handleFormChange}
                />
                <span className="citas-radio-label urgente">Urgente</span>
              </label>
              <label className="citas-radio-option">
                <input 
                  type="radio" 
                  name="prioridad" 
                  value="emergencia" 
                  checked={form.prioridad === 'emergencia'}
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