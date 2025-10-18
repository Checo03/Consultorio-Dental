import React from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Header from "./pages/Header";
import Citas from "./pages/Citas";
import Login from "./pages/Login";
import Pacientes from "./pages/Pacientes";
import Calendario from './pages/Calendario';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/header" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </div>
  );
}

export default App;
