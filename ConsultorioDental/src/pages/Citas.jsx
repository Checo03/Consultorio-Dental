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
          <button 
            className="citas-nueva-cita"
            onClick={() => setShowForm(true)}
          >
            + Nueva Cita
          </button>
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
          <div className="citas-modal-overlay">
            <div className="citas-modal-form">
              <h2 className="citas-modal-title">Nueva Cita</h2>
              
              <div className="citas-form-group">
                <label className="citas-form-label">Nombre del Paciente *</label>
                <input 
                  className="citas-form-input"
                  type="text" 
                  name="paciente" 
                  value={form.paciente} 
                  onChange={handleFormChange} 
                  required 
                  placeholder="Nombre completo del paciente" 
                />
              </div>

              <div className="citas-form-row">
                <div className="citas-form-group">
                  <label className="citas-form-label">Fecha *</label>
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
                  <label className="citas-form-label">Hora *</label>
                  <input 
                    className="citas-form-input"
                    type="time" 
                    name="hora" 
                    value={form.hora} 
                    onChange={handleFormChange} 
                    required 
                  />
                </div>
              </div>

              <div className="citas-form-group">
                <label className="citas-form-label">Teléfono</label>
                <input 
                  className="citas-form-input"
                  type="text" 
                  name="telefono" 
                  value={form.telefono} 
                  onChange={handleFormChange} 
                  placeholder="Número de teléfono" 
                />
              </div>

              <div className="citas-form-group">
                <label className="citas-form-label">Email</label>
                <input 
                  className="citas-form-input"
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleFormChange} 
                  placeholder="correo@ejemplo.com" 
                />
              </div>

              <div className="citas-form-group">
                <label className="citas-form-label">Motivo de la Cita</label>
                <input 
                  className="citas-form-input"
                  type="text" 
                  name="motivo" 
                  value={form.motivo} 
                  onChange={handleFormChange} 
                  placeholder="Consulta general, revisión, etc." 
                />
              </div>

              <div className="citas-form-group">
                <label className="citas-form-label">Notas Adicionales</label>
                <textarea 
                  className="citas-form-textarea"
                  name="notas" 
                  value={form.notas} 
                  onChange={handleFormChange} 
                  placeholder="Información adicional, síntomas, etc." 
                />
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
                  type="button" 
                  className="citas-save-button" 
                  onClick={handleFormSubmit}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}