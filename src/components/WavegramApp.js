import React, { useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, PlusSquare, User, LogOut } from 'lucide-react';
import { postsApi } from '../services/apiSWR';
import { BASE_URL } from '../services/apiSWR';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

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
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (isError) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Error: {isError.message}</div>;
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="flex justify-between items-center p-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">Wavegram</h1>
          <div className="flex items-center space-x-4">
            <LogOut 
              className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" 
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pb-16">

        {/* Posts */}
        {posts.map(post => (
          <article key={post.id} className="border-b border-gray-800 pb-4 mb-4">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <img
                  src={getProfileImage(post.profile_image)}
                  alt={post.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">{post.username}</span>
                {post.location && (
                  <span className="text-sm text-gray-400">• {post.location}</span>
                )}
              </div>
              <MoreHorizontal className="w-6 h-6" />
            </div>

            <div className="relative">
              <img
                src={getPostImage(post.images)}
                alt="post"
                className="w-full"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <Heart className="w-6 h-6" />
                  <MessageCircle className="w-6 h-6" />
                  <Send className="w-6 h-6" />
                </div>
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="font-semibold mb-1">{post.like_count} likes</p>
              <p>
                <span className="font-semibold mr-2">{post.username}</span>
                {post.description}
              </p>
              {post.comment_count > 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  View all {post.comment_count} comments
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">{formatDate(post.created_at)}</p>
            </div>
          </article>
        ))}
        
        {/* Indicatore di caricamento per altri post */}
        {isLoadingMore && (
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Messaggio quando non ci sono più post */}
        {isReachingEnd && posts.length > 0 && (
          <div className="text-center p-4 text-gray-500">
            No more posts to load
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-black border-t border-gray-800">
        <div className="flex justify-around items-center p-4 max-w-2xl mx-auto">
          <Home className="w-6 h-6" />
          <PlusSquare className="w-6 h-6" onClick={onOpenModal}/>
          {currentUser?.profile_image ? (
            <img
              src={getProfileImageUrl(currentUser.profile_image)}
              alt={currentUser.username}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
      </nav>
    </div>
  );
};

export default WavegramApp;