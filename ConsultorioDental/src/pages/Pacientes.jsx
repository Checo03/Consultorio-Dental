import React, { useState, useEffect } from 'react';
import './Pacientes.css';
import Header from './Header';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; 

export default function Pacientes() {
  const [busqueda, setBusqueda] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showHistorialForm, setShowHistorialForm] = useState(false);
  const [showPacienteForm, setShowPacienteForm] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [historialForm, setHistorialForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    diagnostico: '',
    tratamiento: '',
    medicamentos: '',
    observaciones: '',
    proximaCita: ''
  });
  const [pacienteForm, setPacienteForm] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: '',
    celular: '',
    correo: '',
    direccion: ''
  });

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Petición GET con axios
      const response = await axios.get("http://localhost:4000/api/pacientes"); 
      setPacientes(response.data); 
    } catch (err) {
      console.error("Error al obtener pacientes:", err.response?.data || err.message);
      setError("No se pudieron cargar los pacientes. Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleHistorialSubmit = async (e) => {
    e.preventDefault();
    
    const historialData = {
        IDPaciente: selectedPaciente.ID,
        FechaConsulta: historialForm.fecha,
        Diagnostico: historialForm.diagnostico,
        Tratamiento: historialForm.tratamiento,
        Medicamentos: historialForm.medicamentos,
        Observaciones: historialForm.observaciones,
        ProximaCita: historialForm.proximaCita || null // Enviar null si está vacío
    };

    try {
        // Petición POST con axios. Axios maneja el Content-Type y el JSON.stringify
        await axios.post("http://localhost:4000/api/historial", historialData);

        alert('Historial guardado exitosamente. Recargando pacientes...');
        
        // Refrescar la lista de pacientes
        await fetchPacientes();
        
        // Resetear el estado del formulario
        setShowHistorialForm(false);
        setSelectedPaciente(null);
        setHistorialForm({
          fecha: new Date().toISOString().split('T')[0],
          diagnostico: '', tratamiento: '', medicamentos: '', observaciones: '', proximaCita: ''
        });

    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        console.error("Error al enviar historial:", err.response || err);
        alert(`Error al guardar el historial: ${errorMessage}`);
    }
  };

  const doctorString = localStorage.getItem("doctor");
  const doctor = JSON.parse(doctorString);
  const handlePacienteSubmit = async (e) => {
    e.preventDefault();
    
    const nuevoPacienteData = {
        Nombre: pacienteForm.nombre,
        FechaNacimiento: pacienteForm.fechaNacimiento,
        Genero: parseInt(pacienteForm.genero), 
        Celular: pacienteForm.celular,
        Correo: pacienteForm.correo,
        Direccion: pacienteForm.direccion,
        IDDoctor: parseInt(doctor.ID)
    };

    try {
        // Petición POST con axios
        const response = await axios.post(`${API_BASE_URL}/crearPacientes`, nuevoPacienteData);
        const [pacienteCreado] = response.data; 

        // Actualizar el estado de pacientes
        setPacientes(prevPacientes => [...prevPacientes, pacienteCreado]);
        
        // Resetear el estado del formulario
        setShowPacienteForm(false);
        setPacienteForm({ nombre: '', fechaNacimiento: '', genero: '', celular: '', correo: '', direccion: '' });
        alert(`Paciente ${pacienteCreado.Nombre} agregado exitosamente.`);

    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        console.error("Error al crear paciente:", err.response || err);
        alert(`Error al crear el paciente: ${errorMessage}`);
    }
  };

  // --- LÓGICA DE FILTRADO Y FUNCIONES AUXILIARES ---
  
  const pacientesPorEstado = filtro === 'Todos' 
    ? pacientes 
    : pacientes.filter(p => p.Estado === filtro);

  const pacientesFiltrados = busqueda.trim() === ""
    ? pacientesPorEstado
    : pacientesPorEstado.filter(p => {
        const texto = busqueda.toLowerCase();
        return (
          p.Nombre.toLowerCase().includes(texto) ||
          p.Correo.toLowerCase().includes(texto) ||
          p.Celular.toLowerCase().includes(texto) ||
          p.Direccion.toLowerCase().includes(texto)
        );
      });

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
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleHistorialFormChange = (e) => {
    setHistorialForm({ ...historialForm, [e.target.name]: e.target.value });
  };

  const handlePacienteFormChange = (e) => {
    setPacienteForm({ ...pacienteForm, [e.target.name]: e.target.value });
  };

  const abrirHistorial = (paciente) => {
    setSelectedPaciente(paciente);
    setShowHistorialForm(true);
    setHistorialForm({
      fecha: new Date().toISOString().split('T')[0], 
      diagnostico: '', tratamiento: '', medicamentos: '', observaciones: '', proximaCita: ''
    });
  };

  const totalPacientes = pacientes.length;
  const pacientesActivos = pacientes.filter(p => p.Estado === 'Activo').length;
  const pacientesInactivos = pacientes.filter(p => p.Estado === 'Inactivo').length;
  const hoyStr = new Date().toISOString().split('T')[0];
  const consultasHoy = pacientes.filter(p => p.UltimaConsulta && p.UltimaConsulta.split('T')[0] === hoyStr).length;

  return (
    <>
      <Header />
      <div className="pacientes-container">
        <main className="pacientes-main">
          <div className="pacientes-header">
            <div className="pacientes-title-section">
              <h1 className="pacientes-title">Gestión de Pacientes</h1>
              <p className="pacientes-subtitle">Administra la información y historiales clínicos</p>
            </div>
            <button 
              className="pacientes-add-btn"
              onClick={() => setShowPacienteForm(true)}
            >
              <svg className="pacientes-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Paciente
            </button>
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

          <div className="pacientes-filter-busqueda-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '1.5rem 0 1rem 0' }}>
            <div className="pacientes-filter-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
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
            <div className="pacientes-busqueda-section" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <input
                type="text"
                className="pacientes-busqueda-input"
                placeholder="Buscar paciente por nombre, correo, celular o dirección..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ width: '260px', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #b5c9e2', fontSize: '1rem' }}
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#888' }} title="Limpiar búsqueda">✕</button>
              )}
            </div>
          </div>
          
          <div className="pacientes-list-title">
            Lista de Pacientes ({pacientesFiltrados.length})
          </div>

          <div className="pacientes-cards-container">
            {loading ? (
              <div className="pacientes-loading">Cargando pacientes...</div>
            ) : error ? (
                <div className="pacientes-error" style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '5px' }}>
                    {error} 
                    <button onClick={fetchPacientes} style={{ marginLeft: '1rem' }}>Intentar de nuevo</button>
                </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="pacientes-empty">No hay pacientes que coincidan con el filtro/búsqueda.</div>
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
                      disabled={paciente.Estado === 'Inactivo'}
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

          {/* ... Modales de Paciente y Historial (se mantiene el resto) ... */}
          {/* Modal para Agregar Paciente */}
          {showPacienteForm && (
            <div className="pacientes-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPacienteForm(false)}>
              <div className="pacientes-modal-form">
                <div className="pacientes-modal-header">
                  <h2 className="pacientes-modal-title">
                    <svg className="pacientes-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Agregar Nuevo Paciente
                  </h2>
                  <button 
                    className="pacientes-modal-close"
                    onClick={() => setShowPacienteForm(false)}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handlePacienteSubmit}>
                  <div className="pacientes-form-grid">
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label">Nombre Completo *</label>
                      <input 
                        className="pacientes-form-input"
                        type="text" 
                        name="nombre" 
                        value={pacienteForm.nombre} 
                        onChange={handlePacienteFormChange}
                        placeholder="Ej. Juan Pérez González"
                        required 
                      />
                    </div>
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label">Fecha de Nacimiento *</label>
                      <input 
                        className="pacientes-form-input"
                        type="date" 
                        name="fechaNacimiento" 
                        value={pacienteForm.fechaNacimiento} 
                        onChange={handlePacienteFormChange}
                        required 
                      />
                    </div>
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label">Género *</label>
                      <select 
                        className="pacientes-form-input"
                        name="genero" 
                        value={pacienteForm.genero} 
                        onChange={handlePacienteFormChange}
                        required
                      >
                        <option value="">Seleccionar género</option>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                      </select>
                    </div>
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label">Teléfono Celular *</label>
                      <input 
                        className="pacientes-form-input"
                        type="tel" 
                        name="celular" 
                        value={pacienteForm.celular} 
                        onChange={handlePacienteFormChange}
                        placeholder="Ej. 5551234567"
                        required 
                      />
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label">Correo Electrónico *</label>
                      <input 
                        className="pacientes-form-input"
                        type="email" 
                        name="correo" 
                        value={pacienteForm.correo} 
                        onChange={handlePacienteFormChange}
                        placeholder="Ej. juan.perez@email.com"
                        required 
                      />
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label">Dirección</label>
                      <textarea 
                        className="pacientes-form-textarea"
                        name="direccion" 
                        value={pacienteForm.direccion} 
                        onChange={handlePacienteFormChange} 
                        placeholder="Dirección completa del paciente..."
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="pacientes-form-buttons">
                    <button 
                      type="button" 
                      className="pacientes-cancel-button"
                      onClick={() => setShowPacienteForm(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="pacientes-save-button"
                    >
                      <svg className="pacientes-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Paciente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para Historial Clínico */}
          {showHistorialForm && selectedPaciente && (
            <div className="pacientes-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowHistorialForm(false)}>
              <div className="pacientes-modal-form">
                <div className="pacientes-modal-header">
                  <h2 className="pacientes-modal-title">
                    <svg className="pacientes-modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Historial Clínico - {selectedPaciente.Nombre}
                  </h2>
                  <button 
                    className="pacientes-modal-close"
                    onClick={() => { setShowHistorialForm(false); setSelectedPaciente(null); }}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="pacientes-patient-info">
                  <div className="pacientes-patient-details">
                    <span className="pacientes-detail-item"><strong>Edad:</strong> {calcularEdad(selectedPaciente.FechaNacimiento)} años</span>
                    <span className="pacientes-detail-item"><strong>Género:</strong> {selectedPaciente.Genero === 1 ? 'Masculino' : 'Femenino'}</span>
                    <span className="pacientes-detail-item"><strong>Contacto:</strong> {selectedPaciente.Celular}</span>
                  </div>
                </div>
                <form onSubmit={handleHistorialSubmit}>
                  <div className="pacientes-form-grid">
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Fecha de Consulta *</label>
                      <input className="pacientes-form-input" type="date" name="fecha" value={historialForm.fecha} onChange={handleHistorialFormChange} required />
                    </div>
                    <div className="pacientes-form-group">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Próxima Cita</label>
                      <input className="pacientes-form-input" type="date" name="proximaCita" value={historialForm.proximaCita} onChange={handleHistorialFormChange} />
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Diagnóstico *</label>
                      <textarea className="pacientes-form-textarea" name="diagnostico" value={historialForm.diagnostico} onChange={handleHistorialFormChange} placeholder="Descripción detallada del diagnóstico..." rows="4" required/>
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Tratamiento</label>
                      <textarea className="pacientes-form-textarea" name="tratamiento" value={historialForm.tratamiento} onChange={handleHistorialFormChange} placeholder="Descripción del tratamiento indicado..." rows="4"/>
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>Medicamentos</label>
                      <textarea className="pacientes-form-textarea" name="medicamentos" value={historialForm.medicamentos} onChange={handleHistorialFormChange} placeholder="Lista de medicamentos prescritos con dosis y frecuencia..." rows="4"/>
                    </div>
                    <div className="pacientes-form-group full-width">
                      <label className="pacientes-form-label"><svg className="pacientes-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Observaciones</label>
                      <textarea className="pacientes-form-textarea" name="observaciones" value={historialForm.observaciones} onChange={handleHistorialFormChange} placeholder="Observaciones adicionales, síntomas, evolución del paciente..." rows="4"/>
                    </div>
                  </div>
                  <div className="pacientes-form-buttons">
                    <button type="button" className="pacientes-cancel-button" onClick={() => { setShowHistorialForm(false); setSelectedPaciente(null); }}>Cancelar</button>
                    <button type="submit" className="pacientes-save-button">
                      <svg className="pacientes-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Historial
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}