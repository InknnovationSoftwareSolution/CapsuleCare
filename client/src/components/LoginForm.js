import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Importa ToastContainer
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css'; 

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('accessToken', response.data.access_token);
      onLogin(response.data.user);
      toast.success('Inicio de sesión exitoso');
      navigate('/userpage.js'); 
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Credenciales inválidas.');
        } else {
          toast.error('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
        }
      } else {
        toast.error('Error de conexión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <ToastContainer /> {}
      <h2 className="text-xl font-bold mb-2">INICIO DE SESIÓN</h2>
      <p className="mb-6">Ingresa tus datos para acceder</p>
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-blue-500'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
            className={`w-full p-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-blue-500'}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">Iniciar sesión</button>
      </form>
      <p className="mt-4 text-gray-700">
        ¿No tienes una cuenta? <a href="/register" className="text-blue-500">Crea una cuenta</a>
      </p>
    </div>
  );
};

export default LoginForm;
