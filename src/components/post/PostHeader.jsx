import React from 'react';
import { utilities } from '@/styles/appTheme';
import ProfileImage from '../ui/ProfileImage';

const PostHeader = ({ post, currentSlide, totalSlides }) => {
  return (
    <>
      <div className="wg-divider"></div>
      <div className={`${utilities.flexLayout.between} wg-padding-standard`}>
        <div className="flex items-center gap-2">
          <ProfileImage image={post.profile_image} username={post.username} />
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