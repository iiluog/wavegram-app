import React, { useEffect, useCallback } from 'react';
import { postsApi } from '../services/apiSWR';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { customStyles, utilities } from '../styles/appTheme';
import VerticalViewPager from './ui/PostViewPager';

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

  const handlePageChange = (page) => {
    console.log('Page changed:', page);
    if (!isLoadingMore && !isReachingEnd && page === posts.length - 2) {
      console.log('Loading more posts...');
      loadMore();
    }
  };

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

         
        </div>

        {/* Main Content */}
        <main>
          <VerticalViewPager posts={posts} onPageChange={handlePageChange} />
    
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