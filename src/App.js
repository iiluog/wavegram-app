import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import WavegramApp from './components/WavegramApp';
import CreatePostModal from './components/CreatePostModal';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  console.log('Token nel PrivateRoute:', token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <WavegramApp onOpenModal={() => setIsModalOpen(true)} />
                <CreatePostModal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
