import React from 'react';
import { postsApi } from '../services/apiSWR';
import { customStyles, utilities } from '../styles/appTheme';
import PostViewPager from './ui/PostViewPager';
import Header from './Header';

const WavegramApp = ({ onOpenModal }) => {
  const {
    posts,
    isLoading,
    error: isError
  } = postsApi.useGetAll();

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
      </div>
    </div>
  );
};

export default WavegramApp;