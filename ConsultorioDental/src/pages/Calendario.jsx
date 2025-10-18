import React, { useState } from 'react';
import './Calendario.css';
import Header from './Header';

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)); // Septiembre 2024
  const [selectedDate, setSelectedDate] = useState(null);

  // Datos de ejemplo para septiembre 2024 - MÁS CITAS
  const citasEjemplo = [
    // Septiembre 2024
    { 
      ID: 1, 
      Estado: 'PROGRAMADA', 
      Paciente: 'María González', 
      Fecha: '2024-09-02', 
      Hora: '10:00', 
      Motivo: 'Consulta general',
      Prioridad: 'normal'
    },
    { 
      ID: 2, 
      Estado: 'COMPLETADA', 
      Paciente: 'Juan Pérez', 
      Fecha: '2024-09-02', 
      Hora: '14:30', 
      Motivo: 'Revisión médica',
      Prioridad: 'normal'
    },
    { 
      ID: 3, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Ana Rodríguez', 
      Fecha: '2024-09-05', 
      Hora: '09:15', 
      Motivo: 'Seguimiento',
      Prioridad: 'urgente'
    },
    { 
      ID: 4, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Carlos Martínez', 
      Fecha: '2024-09-07', 
      Hora: '11:30', 
      Motivo: 'Chequeo preventivo',
      Prioridad: 'normal'
    },
    { 
      ID: 5, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Laura Sánchez', 
      Fecha: '2024-09-10', 
      Hora: '16:00', 
      Motivo: 'Urgencia',
      Prioridad: 'emergencia'
    },
    { 
      ID: 6, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Pedro López', 
      Fecha: '2024-09-12', 
      Hora: '08:30', 
      Motivo: 'Consulta especializada',
      Prioridad: 'normal'
    },
    { 
      ID: 7, 
      Estado: 'COMPLETADA', 
      Paciente: 'Elena Vázquez', 
      Fecha: '2024-09-12', 
      Hora: '15:00', 
      Motivo: 'Resultados de estudios',
      Prioridad: 'normal'
    },
    { 
      ID: 8, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Roberto Silva', 
      Fecha: '2024-09-15', 
      Hora: '10:45', 
      Motivo: 'Consulta cardiología',
      Prioridad: 'urgente'
    },
    { 
      ID: 9, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Carmen López', 
      Fecha: '2024-09-18', 
      Hora: '12:30', 
      Motivo: 'Chequeo anual',
      Prioridad: 'normal'
    },
    { 
      ID: 10, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Miguel Torres', 
      Fecha: '2024-09-20', 
      Hora: '17:15', 
      Motivo: 'Consulta urgente',
      Prioridad: 'emergencia'
    },
    { 
      ID: 11, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Sofia Herrera', 
      Fecha: '2024-09-23', 
      Hora: '09:00', 
      Motivo: 'Control rutinario',
      Prioridad: 'normal'
    },
    { 
      ID: 12, 
      Estado: 'COMPLETADA', 
      Paciente: 'Diego Morales', 
      Fecha: '2024-09-25', 
      Hora: '11:15', 
      Motivo: 'Seguimiento postoperatorio',
      Prioridad: 'urgente'
    },
    { 
      ID: 13, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Lucia Fernández', 
      Fecha: '2024-09-26', 
      Hora: '14:00', 
      Motivo: 'Consulta dermatológica',
      Prioridad: 'normal'
    },
    { 
      ID: 14, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Ricardo Jiménez', 
      Fecha: '2024-09-28', 
      Hora: '16:30', 
      Motivo: 'Revisión neurológica',
      Prioridad: 'urgente'
    },
    { 
      ID: 15, 
      Estado: 'PROGRAMADA', 
      Paciente: 'Isabel Castro', 
      Fecha: '2024-09-30', 
      Hora: '10:00', 
      Motivo: 'Consulta ginecológica',
      Prioridad: 'normal'
    }
  ];

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Días del siguiente mes para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getCitasForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return citasEjemplo.filter(cita => cita.Fecha === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    if (!date.isCurrentMonth) return;
    setSelectedDate(date.date);
  };

  const formatSelectedDate = (date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="calendario-container">
      <Header />
      <main className="calendario-main">
        <div className="calendario-header">
          <div className="calendario-title-section">
            <h1 className="calendario-title">
              <svg className="calendario-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendario Médico
            </h1>
            <p className="calendario-subtitle">
              <svg className="calendario-subtitle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Gestiona y visualiza todas las citas de manera organizada
            </p>
          </div>
          <div className="calendario-header-stats">
            <div className="calendario-stat-mini">
              <span className="stat-number">{citasEjemplo.filter(c => c.Estado === 'PROGRAMADA').length}</span>
              <span className="stat-label">Programadas</span>
            </div>
            <div className="calendario-stat-mini">
              <span className="stat-number">{citasEjemplo.filter(c => c.Estado === 'COMPLETADA').length}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="calendario-stat-mini">
              <span className="stat-number">{citasEjemplo.filter(c => c.Prioridad === 'emergencia').length}</span>
              <span className="stat-label">Emergencias</span>
            </div>
          </div>
          <div className="calendario-actions">
            <button 
              className="calendario-today-btn"
              onClick={goToToday}
            >
              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hoy
            </button>
            <button 
              className="calendario-nueva-btn"
              onClick={() => alert('Crear nueva cita')}
            >
              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Cita
            </button>
            <button 
              className="calendario-volver-btn"
              onClick={() => window.history.back()}
            >
              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>

        <div className="calendario-layout">
          {/* Navegación compacta del mes */}
          <div className="calendario-month-nav">
            <button 
              className="calendario-nav-btn"
              onClick={() => navigateMonth(-1)}
            >
              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="calendario-month-title">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              className="calendario-nav-btn"
              onClick={() => navigateMonth(1)}
            >
              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="calendario-content">
            {/* Calendario principal - más grande */}
            <div className="calendario-grid-container">
              <div className="calendario-weekdays">
                {daysOfWeek.map(day => (
                  <div key={day} className="calendario-weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendario-days">
                {days.map((dayObj, index) => {
                  const citasDelDia = getCitasForDate(dayObj.date);
                  const isToday = dayObj.date.toDateString() === today.toDateString();
                  const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      className={`calendario-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${citasDelDia.length > 0 ? 'has-citas' : ''}`}
                      onClick={() => handleDateClick(dayObj)}
                    >
                      <span className="calendario-day-number">
                        {dayObj.date.getDate()}
                      </span>
                      
                      {/* Mostrar citas directamente en el día */}
                      {citasDelDia.length > 0 && (
                        <div className="calendario-day-citas">
                          {citasDelDia.slice(0, 3).map((cita, i) => (
                            <div
                              key={i}
                              className={`calendario-cita-mini ${cita.Estado.toLowerCase()} ${cita.Prioridad}`}
                            >
                              <span className="cita-hora">{cita.Hora}</span>
                              <span className="cita-paciente">{cita.Paciente.split(' ')[0]}</span>
                            </div>
                          ))}
                          {citasDelDia.length > 3 && (
                            <div className="calendario-more-citas">
                              +{citasDelDia.length - 3} más
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel lateral para detalles */}
            {selectedDate && (
              <div className="calendario-sidebar">
                <h3 className="calendario-sidebar-title">
                  {formatSelectedDate(selectedDate)}
                </h3>
                
                {getCitasForDate(selectedDate).length === 0 ? (
                  <div className="calendario-no-citas">
                    <svg className="calendario-no-citas-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No hay citas programadas para este día</p>
                    <button className="add-cita-btn">
                      <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar Cita
                    </button>
                  </div>
                ) : (
                  <div className="calendario-citas-list">
                    {getCitasForDate(selectedDate).map(cita => (
                      <div key={cita.ID} className={`calendario-cita-item ${cita.Estado.toLowerCase()}`}>
                        <div className="calendario-cita-header">
                          <div className="calendario-cita-time">
                            <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {cita.Hora}
                          </div>
                          <div className={`calendario-cita-priority ${cita.Prioridad}`}>
                            {cita.Prioridad === 'emergencia' && '🚨'}
                            {cita.Prioridad === 'urgente' && '⚠️'}
                            {cita.Prioridad === 'normal' && '📋'}
                          </div>
                        </div>
                        <div className="calendario-cita-patient">{cita.Paciente}</div>
                        <div className="calendario-cita-motivo">{cita.Motivo}</div>
                        <div className={`calendario-cita-status ${cita.Estado.toLowerCase()}`}>
                          {cita.Estado}
                        </div>
                        <div className="calendario-cita-actions">
                          <button className="cita-action-btn edit">Editar</button>
                          <button className="cita-action-btn complete">Completar</button>
                          <button className="cita-action-btn cancel">Cancelar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}