import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/apiSWR';
import debounce from 'lodash/debounce';
import { customStyles, utilities, theme } from '../styles/appTheme';
import logoHome from '../assets/logo-home.png';

// Crea le funzioni debounced fuori dai callback e dai componenti
const debouncedEmailCheck = debounce(async (emailToCheck, setIsEmailAvailable, setErrors) => {
  if (emailToCheck.length < 5) {
    setIsEmailAvailable(true);
    setErrors(prev => ({ ...prev, email: '' }));
    return;
  }

  try {
    const response = await authApi.checkEmail(emailToCheck);
    setIsEmailAvailable(response.available);
    setErrors(prev => ({
      ...prev,
      email: response.available ? '' : 'Email non disponibile'
    }));
  } catch (error) {
    console.error('Errore nel controllo email:', error);
  }
}, 1000);

const debouncedUsernameCheck = debounce(async (usernameToCheck, setIsUsernameAvailable, setErrors) => {
  if (usernameToCheck.length < 3) {
    setIsUsernameAvailable(true);
    setErrors(prev => ({ ...prev, username: '' }));
    return;
  }

  try {
    const response = await authApi.checkUsername(usernameToCheck);
    setIsUsernameAvailable(response.available);
    setErrors(prev => ({
      ...prev,
      username: response.available ? '' : 'Username non disponibile'
    }));
  } catch (error) {
    console.error('Errore nel controllo username:', error);
  }
}, 1000);

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'L\'immagine deve essere inferiore a 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileImage(file);
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const checkEmail = useCallback((email) => {
    debouncedEmailCheck(email, setIsEmailAvailable, setErrors);
  }, []);

  const checkUsername = useCallback((username) => {
    debouncedUsernameCheck(username, setIsUsernameAvailable, setErrors);
  }, []);

  // Cleanup delle funzioni debounced quando il componente viene smontato
  useEffect(() => {
    return () => {
      debouncedEmailCheck.cancel();
      debouncedUsernameCheck.cancel();
    };
  }, []);

  useEffect(() => {
    if (formData.email) {
      checkEmail(formData.email);
    }
  }, [formData.email, checkEmail]);

  useEffect(() => {
    if (formData.username) {
      checkUsername(formData.username);
    }
  }, [formData.username, checkUsername]);

  const validateForm = () => {
    const newErrors = {};

    if (!profileImage) {
      newErrors.image = 'La foto profilo è obbligatoria';
    }

    if (!formData.username.match(/^[a-z]+$/)) {
      newErrors.username = 'Username deve contenere solo lettere minuscole';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email non valida';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password deve essere almeno 8 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !isUsernameAvailable || !isEmailAvailable) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      const data = await authApi.registerUser(formDataToSend);
      register(data.user, data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Registrazione fallita:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Errore durante la registrazione'
      }));
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

        <div className="m-8 flex justify-center">
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-dotted ${errors.image ? 'border-red-500' : 'border-gray-400'
              }`}>
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#1D1D1D] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {errors.image && (
          <p className={theme.colors.error}>{errors.image}</p>
        )}

        <form onSubmit={handleSubmit} className={customStyles.auth.form}>
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Il tuo username (solo lettere minuscole)"
              className={`${utilities.input.base} ${errors.username ? 'border-red-500' : ''
                }`}
            />
            {errors.username && (
              <p className={theme.colors.error}>{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`${utilities.input.base} ${errors.email ? 'border-red-500' : ''
                }`}
            />
            {errors.email && (
              <p className={theme.colors.error}>{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (almeno 8 caratteri)"
              className={`${utilities.input.base} ${errors.password ? 'border-red-500' : ''
                }`}
            />
            {errors.password && (
              <p className={theme.colors.error}>{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ripeti la password"
              className={`${utilities.input.base} ${errors.confirmPassword ? 'border-red-500' : ''
                }`}
            />
            {errors.confirmPassword && (
              <p className={theme.colors.error}>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isUsernameAvailable || !isEmailAvailable}
            className={`${utilities.button.primary} ${(!isUsernameAvailable || !isEmailAvailable) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Registrati
          </button>

          {errors.submit && (
            <p className={theme.colors.error}>{errors.submit}</p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#1D1D1D]">
            Hai già un account?{' '}
            <Link to="/login" className={customStyles.auth.link}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 