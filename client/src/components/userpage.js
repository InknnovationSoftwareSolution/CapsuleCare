import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:3000/users/me', config);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('No se pudo obtener la información del usuario. Inténtalo de nuevo más tarde.');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No se pudo obtener la información del usuario.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-2">Perfil del Usuario</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <p><strong>Nombre:</strong> {user.userName}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button 
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
        onClick={onLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserPage;
