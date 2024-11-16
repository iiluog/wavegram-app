import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/apiSWR';
import { utilities, customStyles } from '../styles/appTheme';
import logoHome from '../assets/logo-home.png';

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
    <div className={customStyles.auth.container}>
      <div className={utilities.container.maxWidthMd}>
        {/* Logo */}
        <img
          src={logoHome}
          alt="WAVEGRAM©"
          className={customStyles.logo}
        />

        <form onSubmit={handleSubmit} className={customStyles.auth.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Il tuo username (solo lettere minuscole)"
            className={utilities.input.base}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (almeno 8 caratteri)"
            className={utilities.input.base}
          />

          <button
            type="submit"
            className={utilities.button.primary}
          >
            Accedi
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#1D1D1D]">
            Non hai un account?{' '}
            <Link to="/register" className={customStyles.auth.link}>
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 