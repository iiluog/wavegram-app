import React, { useState, useRef, useEffect } from 'react';
import logoHome from '@/assets/Logo.svg';
import Post from '../Post';
import { postsApi } from '@/services/apiSWR';
import { useInView } from 'react-intersection-observer';

const Page = ({ post, index, onIntersect }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    onChange: (inView) => onIntersect(index, inView)
  });

  return (
    <div
      ref={ref}
      className='sticky top-0 h-screen bg-background'
      id={`header${index}`}
      data-page-index={index}
    >
      <div className='h-screen'>
        <Post post={post} />
      </div>
    </div>
  );
};

const PostViewPager = ({ posts = [] }) => {
  const containerRef = useRef(null);
  const [currentPost, setCurrentPost] = useState(0);
  const { loadMore, isLoadingMore, isReachingEnd } = postsApi.useGetAll();

  const handleIntersection = (index, inView) => {
    if (inView) {
      setCurrentPost(index);
      
      // Load more posts when reaching near the end
      if (index >= posts.length - 2 && !isLoadingMore && !isReachingEnd) {
        loadMore();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute top-14 h-dvh w-full pb-0 overflow-y-scroll snap-y snap-mandatory"
      id="container"
    >
      <div
        className='h-dvh bg-background flex items-end justify-center'
        id={`header-logo`}
      >
        <img
          src={logoHome}
          alt="WAVEGRAM"
          className="wg-logo mb-14"
        />
      </div>
      {posts.map((post, index) => (
        <Page
          key={post.id}
          post={post}
          index={index}
          onIntersect={handleIntersection}
        />
      ))}
    </div>
  );
};

export default PostViewPager;