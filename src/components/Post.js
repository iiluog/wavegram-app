import React, { useState } from 'react';
import PostHeader from './post/PostHeader';
import PostActions from './post/PostActions';
import PostCarousel from './post/PostCarousel';
import PostDescription from './post/PostDescription';
import { customStyles } from '../styles/appTheme';

const Post = ({ post, onProfileClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);

  return (
    <article className={customStyles.post.container}>
      <PostHeader
        post={post}
        currentSlide={currentSlide}
        totalSlides={post.images?.length || 0}
        onProfileClick={onProfileClick}
      />
      <PostCarousel
        images={post.images}
        onSlideChange={setCurrentSlide}
        api={api}
        setApi={setApi}
      />
      <PostActions post={post} />
      <PostDescription description={post.description} />
    </article>
  );
};

export default Post; 