import React, { useEffect, useRef } from 'react';
import { postsApi } from '../services/apiSWR';
import { customStyles, utilities } from '../styles/appTheme';
import PostViewPager from './ui/PostViewPager';
import Header from './Header';

const WavegramApp = ({ onOpenModal }) => {
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

  if (isLoading) {
    return <div className={customStyles.errorContainer}>Loading...</div>;
  }

  if (isError) {
    return <div className={customStyles.errorContainer}>Error: {isError.message}</div>;
  }

  return (
    <div className={utilities.container.maxWidth}>
      <Header onOpenModal={onOpenModal} />
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