import React, { useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, PlusSquare, User, LogOut, Share } from 'lucide-react';
import { postsApi } from '../services/apiSWR';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import logoHome from '../assets/logo-home.png';
import Post from './Post';
import { customStyles, utilities } from '../styles/appTheme';

const WavegramApp = ({ onOpenModal }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentUser, getProfileImageUrl } = useUserStore();
  const {
    posts,
    isLoading,
    isLoadingMore,
    loadMore,
    isReachingEnd,
    error: isError
  } = postsApi.useGetAll();

  // Funzione per controllare se siamo vicini alla fine
  const handleScroll = useCallback(() => {
    if (isLoadingMore || isReachingEnd) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Carica più post quando siamo a 300px dalla fine
    if (scrollHeight - scrollTop - clientHeight < 300) {
      loadMore();
    }
  }, [isLoadingMore, isReachingEnd, loadMore]);

  // Aggiungi l'event listener per lo scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Funzione per gestire il logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className={customStyles.errorContainer}>Loading...</div>;
  }

  if (isError) {
    return <div className={customStyles.errorContainer}>Error: {isError.message}</div>;
  }

  return (
    <div className={customStyles.pageContainer}>
      <div className={utilities.container.maxWidth}>
        {/* Header */}
        <div className={customStyles.header.base}>
          <div className={utilities.flexLayout.between}>
            <span className="wg-txt-primary">
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).replace(/\//g, '.')}
            </span>
            <div className={utilities.flexLayout.center}>
              {currentUser?.profile_image && (
                <img
                  src={getProfileImageUrl(currentUser.profile_image)}
                  alt={currentUser.username}
                  className="wg-profile-image"
                  onClick={handleLogout}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <span
                className="text-3xl ml-2 font-bold text-textPrimary cursor-pointer hover:opacity-80"
                onClick={onOpenModal}
              >
                +
              </span>
            </div>
          </div>

          {/* Logo */}
          <img
            src={logoHome}
            alt="WAVEGRAM©"
            className="wg-logo"
          />
        </div>

        {/* Main Content */}
        <main className="pb-24">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}

          {isLoadingMore && (
            <div className={customStyles.loadingContainer}>
              <div className={customStyles.loadingSpinner}></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WavegramApp;