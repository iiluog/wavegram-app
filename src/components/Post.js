import React, { useState } from 'react';
import PostHeader from './post/PostHeader';
import PostActions from './post/PostActions';
import PostCarousel from './post/PostCarousel';
import PostDescription from './post/PostDescription';
import PostTags from './post/PostTags';
import { customStyles } from '../styles/appTheme';
import useUserStore from '@/stores/userStore';

const Post = ({ post, onProfileClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const currentUser = useUserStore((state) => state.currentUser);
  
  const isOwnPost = post.user_id === currentUser?.id;

  const handleAddTag = () => {
    // Implementare la logica per aggiungere un tag
    console.log('Add tag clicked');
  };

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
      <PostTags 
        tags={post.tags ?? []} 
        isOwnPost={isOwnPost}
        onProfileClick={onProfileClick}
        onAddTag={handleAddTag}
      />
      <PostDescription description={post.description} />
    </article>
  );
};

export default Post; 