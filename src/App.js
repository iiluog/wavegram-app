import React, { useState } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate, 
  ScrollRestoration,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import WavegramApp from './components/WavegramApp';
import CreatePostModal from './components/CreatePostModal';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// Componente wrapper che include ScrollRestoration
const AppWrapper = ({ children }) => (
  <>
    <ScrollRestoration />
    {children}
  </>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/login"
          element={<AppWrapper><Login /></AppWrapper>}
        />
        <Route
          path="/register"
          element={<AppWrapper><Register /></AppWrapper>}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppWrapper>
                <WavegramApp onOpenModal={() => setIsModalOpen(true)} />
                <CreatePostModal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                />
              </AppWrapper>
            </PrivateRoute>
          }
          preventScrollReset={true}
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <AppWrapper>
                <Profile />
              </AppWrapper>
            </PrivateRoute>
          }
          preventScrollReset={true}
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
      </>
    ),
    {
      future: {
        v7_startTransition: true
      }
    }
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
