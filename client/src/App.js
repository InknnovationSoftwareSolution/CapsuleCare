
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import MedicineForm from './components/MedicineForm';
import axios from 'axios';
import './App.css'; 
import 'react-toastify/dist/ReactToastify.css'; 

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('accessToken');
  };

  const handleMedicineRegistration = async (medicineData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('http://localhost:3000/medications', medicineData, config);
      alert('Registro de medicamento exitoso');
    } catch (error) {
      console.error('Error registrando medicamento:', error);
      alert('Error al registrar medicamento');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!loggedInUser ? <Navigate to="/login" /> : <Navigate to="/main" />} />
        <Route path="/login" element={loggedInUser ? <Navigate to="/main" /> : <LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/main" element={loggedInUser ? (
          <div>
            <h1>Bienvenido, {loggedInUser.name}</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <MedicineForm onMedicineSubmit={handleMedicineRegistration} />
          </div>
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
    </Router>
  );
};

export default App;
