import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [userName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
  });

  // Validación de campos
  const validateFields = () => {
    const newErrors = {
      userName: '',
      email: '',
      password: '',
    };

    if (!userName) {
      newErrors.userName = 'El nombre es obligatorio';
    }
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  // Manejo del cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'userName') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    // Limpia el error correspondiente
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Manejo del envío del formulario
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
      const response = await axios.post('http://localhost:3000/users/register', {
        userName,
        email,
        password,
      });
      toast.success('Registro exitoso');
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        let errorMessage = 'Error al registrar usuario. Inténtalo de nuevo más tarde.';
        
        switch (status) {
          case 400:
            errorMessage = data.message || 'Solicitud incorrecta. Verifica los datos ingresados.';
            break;
          case 401:
            errorMessage = 'No autorizado. Verifica tus credenciales.';
            break;
          case 403:
            errorMessage = 'Acceso denegado.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 409:
            errorMessage = data.message || 'El correo electrónico ya está registrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
            break;
          default:
            errorMessage = 'Error desconocido. Inténtalo de nuevo más tarde.';
        }

        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Error de conexión. Inténtalo de nuevo más tarde.');
      } else {
        toast.error('Error desconocido. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
        <button 
          className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded"
          onClick={() => window.location.href = '/login'}
        >
          Regresar
        </button>
        <h2 className="text-xl font-bold mb-2">REGISTRO</h2>
        <p className="mb-6">Date de alta llenando los siguientes datos</p>
        <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              placeholder="Introduce tu nombre"
              className={`w-full p-2 border rounded-lg ${errors.userName ? 'border-red-500' : 'border-blue-500'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-blue-500'}`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Introduce tu contraseña"
              className={`w-full p-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-blue-500'}`}
            />
          </div>
          <button 
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg"
          >
            Crear cuenta
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterForm;
