import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserPage from './components/UserPage';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!loggedInUser ? <Navigate to="/login" /> : <Navigate to="/userpage" />} />
        <Route path="/login" element={loggedInUser ? <Navigate to="/userpage" /> : <LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/userpage" element={loggedInUser ? (
          <UserPage onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
    </Router>
  );
};

export default App;
