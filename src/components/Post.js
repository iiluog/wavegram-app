import React, { useState } from 'react';
import PostHeader from './post/PostHeader';
import PostActions from './post/PostActions';
import PostCarousel from './post/PostCarousel';
import PostDescription from './post/PostDescription';
import PostTags from './post/PostTags';
import { customStyles } from '../styles/appTheme';
import useUserStore from '@/stores/userStore';
import { tagsApi } from '@/services/apiSWR';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const [tags, setTags] = useState(post.tags ?? []);
  const currentUser = useUserStore((state) => state.currentUser);
  
  const isOwnPost = post.user_id === currentUser?.id;

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleAddTag = async (userId) => {
    try {
      const response = await tagsApi.addTag(post.id, userId);
      if (response.tags) {
        setTags(response.tags);
      }
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  return (
    <article className={customStyles.post.container}>
      <PostHeader
        post={post}
        currentSlide={currentSlide}
        totalSlides={post.images?.length || 0}
        onProfileClick={handleProfileClick}
      />
      <PostCarousel
        images={post.images}
        onSlideChange={setCurrentSlide}
        api={api}
        setApi={setApi}
      />
      <PostActions post={post} />
      <PostTags 
        tags={tags}
        isOwnPost={isOwnPost}
        onProfileClick={(username) => handleProfileClick(username)}
        onAddTag={handleAddTag}
        postId={post.id}
      />
      <PostDescription description={post.description} />
    </article>
  );
};

export default Post; 