import React, { useEffect, useCallback, useRef } from 'react';
import { postsApi } from '../services/apiSWR';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { customStyles, utilities } from '../styles/appTheme';
import PostViewPager from './ui/PostViewPager';
import Header from './Header';

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

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !isReachingEnd) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoadingMore, isReachingEnd, loadMore]);

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
    <div className={utilities.container.maxWidth}>
      <Header onOpenModal={onOpenModal} onLogout={handleLogout} />
      <div className={customStyles.pageContainer}>
        <PostViewPager posts={posts} />

        {/* Observer target and loading spinner */}
        <div ref={observerTarget} style={{ height: '20px' }}>
          {isLoadingMore && (
            <div className={customStyles.loadingContainer}>
              <div className={customStyles.loadingSpinner}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WavegramApp;