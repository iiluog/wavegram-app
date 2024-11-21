import React from 'react';
import { utilities } from '@/styles/appTheme';
import ProfileImage from '../ui/ProfileImage';

const PostHeader = ({ post, currentSlide, totalSlides, onProfileClick }) => {
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick(post.username);
    }
  };

  return (
    <>
      <div className="wg-divider"></div>
      <div className={`${utilities.flexLayout.between} wg-padding-standard`}>
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleProfileClick}
        >
          <ProfileImage 
            image={post.profile_image} 
            username={post.username} 
            onClick={handleProfileClick}
          />
          <span className="wg-txt-primary">{post.username}</span>
        </div>
        {totalSlides > 1 && (
          <div className="wg-txt-primary">
            {currentSlide + 1}/{totalSlides}
          </div>
        )}
      </div>
    </>
  );
};

export default PostHeader; 