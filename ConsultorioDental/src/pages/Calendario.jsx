import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendario.css';
import Header from './Header';

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [citas, setCitas] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    setSelectedDate(new Date()); 
    fetchCitas();
  }, [currentDate]); 

  const updateCitaStatus = async (citaID, newStatus) => {
    let actionText = '';
    if (newStatus === 2) {
        actionText = '¿Estás seguro de que deseas MARCAR esta cita como COMPLETADA?';
    } else if (newStatus === 3) {
        actionText = '¿Estás seguro de que deseas CANCELAR esta cita? Esta acción no se puede deshacer.';
    } else {
        return; 
    }

    if (!window.confirm(actionText)) {
        // Si el usuario presiona "Cancelar" o cierra el diálogo, salir de la función
        return;
    }
    
    try {
        const response = await axios.post("http://localhost:4000/api/citasEstado", {
            ID: citaID,       
            Estado: newStatus 
        });

        console.log(`Cita ${citaID} actualizada a estado ${newStatus}`, response.data);
        fetchCitas(); 

    } catch (err) {
        console.error("Fallo al actualizar el estado de la cita:", err);
        alert("Error al actualizar la cita. Verifique la conexión con el servidor.");
    }
  };

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = formatDateForAPI(new Date(year, month, 1));
    const endDate = formatDateForAPI(new Date(year, month + 1, 0)); 

    try {
      const response = await axios.get("http://localhost:4000/api/citas", {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      
      setCitas(response.data); 

    } catch (err) {
      console.error("Fallo al obtener citas:", err);
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        const prevDate = new Date(year, month, 1 - (startingDayOfWeek - i));
        days.push({ date: prevDate, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push({ date, isCurrentMonth: true });
    }
    const totalDaysToShow = 42; 
    const remainingDays = totalDaysToShow - days.length;
    for (let day = 1; day <= remainingDays; day++) {
        const nextDate = new Date(year, month + 1, day);
        days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
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

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getCitasForDate = (date) => {
    const dateStr = formatDateForAPI(date);
    
    return citas.filter(cita => {
        const citaDateStr = cita.Fecha.substring(0, 10);
        return citaDateStr === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null); 
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (dayObj) => {
    if (!dayObj.isCurrentMonth) return;
    const cleanDate = new Date(dayObj.date.getFullYear(), dayObj.date.getMonth(), dayObj.date.getDate());
    setSelectedDate(cleanDate);
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
  
  const citasProgramadas = citas.filter(c => c.Estado === 1).length; 
  const citasCompletadas = citas.filter(c => c.Estado === 2).length; 
  const citasEmergencia = citas.filter(c => c.Estado === 3).length;


  if (loading) {
    return <div className="loading-container">Cargando citas...</div>;
  }

  if (error) {
    return <div className="error-container">Error al conectar con la base de datos: **{error}**. Verifica la consola para más detalles.</div>;
  }

  const getPrioridadClass = (prioridadCode) => {
    switch (prioridadCode) {
        case 1:
            return 'normal';
        case 2:
            return 'urgente';
        case 3:
            return 'emergencia';
        default:
            return 'normal'; 
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
  const mapEstado = (estadoNum) => {
    switch (estadoNum) {
        case 1:
            return { text: 'PROGRAMADA', className: 'programada' };
        case 2:
            return { text: 'COMPLETADA', className: 'completada' };
        case 3:
            return { text: 'CANCELADA', className: 'cancelada' };
        default:
            return { text: 'Desconocido', className: 'desconocido' };
    }
  };

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
              <span className="stat-number">{citasProgramadas}</span>
              <span className="stat-label">Programadas</span>
            </div>
            <div className="calendario-stat-mini">
              <span className="stat-number">{citasCompletadas}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="calendario-stat-mini">
              <span className="stat-number">{citasEmergencia}</span>
              <span className="stat-label">Canceladas</span>
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
                              className={`calendario-cita-mini ${getEstadoClass(cita.Estado)} ${getPrioridadClass(cita.Prioridad)}`}
                            >
                              <span className="cita-hora">{formatTime(cita.Hora)}</span>
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
                          <button 
                              className="add-cita-btn"
                              onClick={() => window.location.href = '/citas'}
                          >
                              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Agregar Cita
                          </button>
                      </div>
                  ) : (
                      <div className="calendario-citas-list">
                          {getCitasForDate(selectedDate).map(cita => {
                              const estadoMapeado = mapEstado(cita.Estado);

                              return (
                                  <div 
                                      key={cita.ID} 
                                      className={`calendario-cita-item ${estadoMapeado.className}`} 
                                  >
                                      <div className="calendario-cita-header">
                                          <div className="calendario-cita-time">
                                              <svg className="calendario-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                              </svg>
                                              {formatTime(cita.Hora)}
                                          </div>
                                          <div className={`calendario-cita-priority ${getPrioridadClass(cita.Prioridad)}`}>
                                              {cita.Prioridad === 3 && '🚨'}
                                              {cita.Prioridad === 2 && '⚠️'}
                                              {cita.Prioridad === 1 && '📋'}
                                          </div>
                                      </div>
                                      <div className="calendario-cita-patient">{cita.Paciente}</div>
                                      <div className="calendario-cita-motivo">{cita.Motivo}</div>
                                      
                                      <div className={`calendario-cita-status ${estadoMapeado.className}`}>
                                          {estadoMapeado.text} 
                                      </div>
                                      
                                      <div className="calendario-cita-actions">            
                                        <button 
                                            className="cita-action-btn complete"
                                            onClick={() => updateCitaStatus(cita.ID, 2)}
                                            disabled={cita.Estado === 2 || cita.Estado === 3} 
                                        >
                                            Completar
                                        </button>                                        
                                        <button 
                                            className="cita-action-btn cancel"
                                            onClick={() => updateCitaStatus(cita.ID, 3)}
                                            disabled={cita.Estado === 3 || cita.Estado === 2}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                  </div>
                              );
                          })}
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