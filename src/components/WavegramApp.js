import React, { useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, PlusSquare, User, LogOut, Share } from 'lucide-react';
import { postsApi } from '../services/apiSWR';
import { BASE_URL } from '../services/apiSWR';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import logoHome from '../assets/logo-home.png';

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
    return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Error: {isError.message}</div>;
  }

  // Funzione helper per ottenere la prima immagine del post
  const getPostImage = (images) => {
    if (images && images.length > 0) {
      return `${BASE_URL}/uploads/${images[0]}`;
    }
    return 'https://placehold.co/400x400?text=Not+available';
  };

  // Funzione helper per ottenere la prima immagine del post
  const getProfileImage = (image) => {
    if (image) {
      return `${BASE_URL}/uploads/${image}`;
    }
    return 'https://placehold.co/40x40?text=.';
  };

  // Funzione per formattare la data
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  return (
    <div className="min-h-screen bg-[#E6E6E6] text-black flex justify-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#E6E6E6] z-50 px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-medium text-[#1D1D1D]">
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).replace(/\//g, '.')}
            </span>
            <div className="flex items-center">
              {currentUser?.profile_image && (
                <img
                  src={getProfileImageUrl(currentUser.profile_image)}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className="text-3xl ml-2 font-bold text-[#1D1D1D]" onClick={onOpenModal}>+</span>
            </div>
          </div>

          {/* Logo */}
          <img 
            src={logoHome} 
            alt="WAVEGRAM©" 
            className="w-full max-w-xl px-4 py-2"
          />
        </div>
        
        {/* Main Content */}
        <main className="pb-24">
          {posts.map((post, index) => (
            <article key={post.id} className="mb-6 pb-6">
              {/* Divider line */}
              <div className="w-full h-[1px] bg-black mb-4"></div>
              
              {/* User Info */}
              <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(post.profile_image)}
                    alt={post.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-2xl uppercase font-medium text-[#1D1D1D]">{post.username}</span>
                </div>
                <span className="text-2xl font-medium text-[#1d1d1d]">1/{post.images?.length || 0}</span>
              </div>

              {/* Post Image */}
              <div className="relative px-4">
                <img
                  src={getPostImage(post.images)}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
              </div>

              {/* Post Actions & Info */}
              <div className="px-4 pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button className="w-6 h-6"><Heart size={24} /></button>
                    <button className="w-6 h-6"><MessageCircle size={24} /></button>
                    <button className="w-6 h-6"><Send size={24} /></button>
                  </div>
                  <div className="flex flex-col text-base items-end justify-center text-[#5E5E5E] leading-tight">
                    <span className="font-sm">BigRock</span>
                    <span className="text-sm">{formatDate(post.created_at)}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-normal mb-2 text-[#171717] text-base">
                    {post.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad dfghjukilo fguitm oip8 yuiloipyaèi yoieo0+ altro...'}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {isLoadingMore && (
            <div className="text-center p-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#171717]"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WavegramApp;