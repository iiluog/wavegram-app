import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/apiSWR';
import { utilities, customStyles } from '../styles/appTheme';
import logoHome from '../assets/logo-home.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Username obbligatorio';
    } else if (!username.match(/^[a-z]+$/)) {
      newErrors.username = 'Username deve contenere solo lettere minuscole';
    }

    if (!password) {
      newErrors.password = 'Password obbligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'Password deve essere almeno 8 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await authApi.loginUser(username, password);
      login(data.user, data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Username o password non validi'
      }));
    }
  };

  return (
    <div className={customStyles.formContainer}>
      <div className={utilities.container.maxWidthMd}>
        {/* Logo */}
        <img
          src={logoHome}
          alt="WAVEGRAM©"
          className="wg-logo mb-16"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Il tuo username (solo lettere minuscole)"
              className={`${utilities.input.base} ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && (
              <p className="text-error">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (almeno 8 caratteri)"
              className={`${utilities.input.base} ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="text-error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`wg-button-primary ${(!username || !password) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Accedi
          </button>

          {errors.submit && (
            <p className="text-error">{errors.submit}</p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#1D1D1D]">
            Non hai un account?{' '}
            <Link to="/register" className="wg-txt-link">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 