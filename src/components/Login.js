import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/apiSWR';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authApi.loginUser(username, password);
      login(data.user, data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-white text-4xl font-bold text-center mb-12">
          Wavegram
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Il tuo username (solo lettere minuscole)"
            className="w-full bg-transparent text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-gray-500"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (almeno 8 caratteri)"
            className="w-full bg-transparent text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-gray-500"
          />
          
          <button
            type="submit"
            className="w-full bg-gray-700 text-white rounded-lg p-4 hover:bg-gray-600 transition-colors"
          >
            Accedi
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white">
            Non hai un account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 