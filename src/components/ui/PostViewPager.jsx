import React, { useState, useRef, useEffect } from 'react';
import logoHome from '@/assets/logo-home.png';
import Post from '../Post';

const Page = ({ post, index }) => (
  <div
    className='sticky top-0 h-screen bg-background'
    id={`header${index}`}
    data-page-index={index}
  >
    <div className='h-screen'>
      <Post post={post} />
    </div>
  </div>
);

const PostViewPager = ({ posts = [], onProfileClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);


  if (!posts.length) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-14 h-dvh w-full pb-0 overflow-y-scroll"
      id="container"
    >
      <div
        className='h-dvh bg-background flex items-end justify-center'
        id={`header-logo`}
      >
        <img
          src={logoHome}
          alt="WAVEGRAM©"
          className="wg-logo mb-14"
        />
      </div>
      {posts.map((post, index) => (
        <Page
          key={index}
          post={post}
          index={index + 1}
        />
      ))}
    </div>
  );
};

export default PostViewPager;