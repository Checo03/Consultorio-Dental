import React, { useState, useEffect } from 'react';
import './Pacientes.css';
import Header from './Header';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistorialForm, setShowHistorialForm] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [historialForm, setHistorialForm] = useState({
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: '',
    observaciones: '',
    proximaCita: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setPacientes([
        {
          ID: 1,
          Nombre: 'Juan Pérez',
          FechaNacimiento: '1990-05-10',
          Genero: 1,
          Celular: '5551234567',
          Correo: 'juan.perez@mail.com',
          Direccion: 'Calle Falsa 123',
          UltimaConsulta: '2024-01-10',
          Estado: 'Activo'
        },
        {
          ID: 2,
          Nombre: 'Ana López',
          FechaNacimiento: '1985-08-22',
          Genero: 2,
          Celular: '5559876543',
          Correo: 'ana.lopez@mail.com',
          Direccion: 'Av. Real 456',
          UltimaConsulta: '2024-01-05',
          Estado: 'Activo'
        },
        {
          ID: 3,
          Nombre: 'Carlos Rodríguez',
          FechaNacimiento: '1978-12-15',
          Genero: 1,
          Celular: '5551112233',
          Correo: 'carlos.rodriguez@mail.com',
          Direccion: 'Blvd. Central 789',
          UltimaConsulta: '2023-12-20',
          Estado: 'Inactivo'
        },
        {
          ID: 4,
          Nombre: 'María González',
          FechaNacimiento: '1992-03-08',
          Genero: 2,
          Celular: '5554445566',
          Correo: 'maria.gonzalez@mail.com',
          Direccion: 'Calle Norte 321',
          UltimaConsulta: '2024-01-12',
          Estado: 'Activo'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const pacientesFiltrados = filtro === 'Todos' 
    ? pacientes 
    : pacientes.filter(p => p.Estado === filtro);

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHistorialSubmit = (e) => {
    e.preventDefault();
    console.log('Historial agregado para:', selectedPaciente.Nombre, historialForm);
    setShowHistorialForm(false);
    setSelectedPaciente(null);
    setHistorialForm({
      fecha: '',
      diagnostico: '',
      tratamiento: '',
      medicamentos: '',
      observaciones: '',
      proximaCita: ''
    });
  };

  const handleHistorialFormChange = (e) => {
    setHistorialForm({
      ...historialForm,
      [e.target.name]: e.target.value
    });
  };

  const abrirHistorial = (paciente) => {
    setSelectedPaciente(paciente);
    setShowHistorialForm(true);
    setHistorialForm({
      ...historialForm,
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const totalPacientes = pacientes.length;
  const pacientesActivos = pacientes.filter(p => p.Estado === 'Activo').length;
  const pacientesInactivos = pacientes.filter(p => p.Estado === 'Inactivo').length;
  const consultasHoy = pacientes.filter(p => 
    new Date(p.UltimaConsulta).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="pacientes-container">
      <Header />
      <main className="pacientes-main">
        <div className="pacientes-header">
          <div className="pacientes-title-section">
            <h1 className="pacientes-title">Gestión de Pacientes</h1>
            <p className="pacientes-subtitle">Administra la información y historiales clínicos</p>
          </div>
        </div>

        <div className="pacientes-stats-container">
          <div className="pacientes-stat-card total">
            <div className="pacientes-stat-number">{totalPacientes}</div>
            <div className="pacientes-stat-label">TOTAL PACIENTES</div>
          </div>
          <div className="pacientes-stat-card activos">
            <div className="pacientes-stat-number">{pacientesActivos}</div>
            <div className="pacientes-stat-label">ACTIVOS</div>
          </div>
          <div className="pacientes-stat-card inactivos">
            <div className="pacientes-stat-number">{pacientesInactivos}</div>
            <div className="pacientes-stat-label">INACTIVOS</div>
          </div>
          <div className="pacientes-stat-card consultas">
            <div className="pacientes-stat-number">{consultasHoy}</div>
            <div className="pacientes-stat-label">CONSULTAS HOY</div>
          </div>
        </div>

        <div className="pacientes-filter-section">
          <span className="pacientes-filter-label">Filtrar por estado:</span>
          <select 
            className="pacientes-select"
            value={filtro} 
            onChange={e => setFiltro(e.target.value)}
          >
            <option>Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="pacientes-list-title">
          Lista de Pacientes ({pacientesFiltrados.length})
        </div>

        <div className="pacientes-cards-container">
          {loading ? (
            <div className="pacientes-loading">Cargando pacientes...</div>
          ) : pacientesFiltrados.length === 0 ? (
            <div className="pacientes-empty">No hay pacientes registrados.</div>
          ) : (
            pacientesFiltrados.map(paciente => (
              <div key={paciente.ID} className={`pacientes-card ${paciente.Estado.toLowerCase()}`}>
                <div className="pacientes-card-header">
                  <span className="pacientes-patient-name">{paciente.Nombre}</span>
                  <span className={`pacientes-status-badge ${paciente.Estado.toLowerCase()}`}>
                    {paciente.Estado}
                  </span>
                </div>
                <div className="pacientes-card-content">
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{calcularEdad(paciente.FechaNacimiento)} años - {paciente.Genero === 1 ? 'Masculino' : 'Femenino'}</span>
                  </div>
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Nació: {formatearFecha(paciente.FechaNacimiento)}</span>
                  </div>
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{paciente.Celular}</span>
                  </div>
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{paciente.Correo}</span>
                  </div>
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{paciente.Direccion}</span>
                  </div>
                  <div className="pacientes-info-row">
                    <svg className="pacientes-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Última consulta: {formatearFecha(paciente.UltimaConsulta)}</span>
                  </div>
                </div>
                <div className="pacientes-card-actions">
                  <button 
                    className="pacientes-historial-btn"
                    onClick={() => abrirHistorial(paciente)}
                  >
                    <svg className="pacientes-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Agregar Historial
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showHistorialForm && selectedPaciente && (
          <div className="pacientes-modal-overlay">
            <div className="pacientes-modal-form">
              <h2 className="pacientes-modal-title">
                Agregar Historial Clínico - {selectedPaciente.Nombre}
              </h2>
              
              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Fecha de Consulta *</label>
                <input 
                  className="pacientes-form-input"
                  type="date" 
                  name="fecha" 
                  value={historialForm.fecha} 
                  onChange={handleHistorialFormChange} 
                  required 
                />
              </div>

              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Diagnóstico *</label>
                <textarea 
                  className="pacientes-form-textarea"
                  name="diagnostico" 
                  value={historialForm.diagnostico} 
                  onChange={handleHistorialFormChange} 
                  placeholder="Descripción del diagnóstico..."
                  required
                />
              </div>

              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Tratamiento</label>
                <textarea 
                  className="pacientes-form-textarea"
                  name="tratamiento" 
                  value={historialForm.tratamiento} 
                  onChange={handleHistorialFormChange} 
                  placeholder="Descripción del tratamiento indicado..."
                />
              </div>

              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Medicamentos</label>
                <textarea 
                  className="pacientes-form-textarea"
                  name="medicamentos" 
                  value={historialForm.medicamentos} 
                  onChange={handleHistorialFormChange} 
                  placeholder="Lista de medicamentos prescritos..."
                />
              </div>

              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Observaciones</label>
                <textarea 
                  className="pacientes-form-textarea"
                  name="observaciones" 
                  value={historialForm.observaciones} 
                  onChange={handleHistorialFormChange} 
                  placeholder="Observaciones adicionales, síntomas, etc..."
                />
              </div>

              <div className="pacientes-form-group">
                <label className="pacientes-form-label">Próxima Cita</label>
                <input 
                  className="pacientes-form-input"
                  type="date" 
                  name="proximaCita" 
                  value={historialForm.proximaCita} 
                  onChange={handleHistorialFormChange} 
                />
              </div>

              <div className="pacientes-form-buttons">
                <button 
                  type="button" 
                  className="pacientes-cancel-button"
                  onClick={() => {
                    setShowHistorialForm(false);
                    setSelectedPaciente(null);
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="pacientes-save-button" 
                  onClick={handleHistorialSubmit}
                >
                  Guardar Historial
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}