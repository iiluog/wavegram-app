import React, { useState, useRef, useEffect } from 'react';
import logoHome from '@/assets/logo-home.png';
import Post from '../Post';

const Page = ({ post, index }) => (
    <div
      className='sticky top-14 bg-background'
      id={`header${index}`}
      style={{ zIndex: index }}
    >
      <div className='h-screen'>
        <Post post={post} />
      </div>
    </div>
);

const VerticalViewPager = ({ posts = [], onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Notify parent component when currentPage changes
    onPageChange?.(currentPage);
  }, [currentPage]);

  if (!posts.length) return null;

  return (
    <div className="flex flex-row items-center justify-center" id='container-wrapper'>
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-y-scroll"
        id="container"
      >
        
        {posts.map((page, index) => (
          <Page
            key={index}
            post={page}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalViewPager;