import React from 'react';
import { utilities } from '@/styles/appTheme';
import ProfileImage from '../ui/ProfileImage';
import { formatDate } from '@/utils/dateUtils';

const CommentHeader = ({ comment }) => {
  return (
    <div className={`${utilities.flexLayout.between} px-4`}>
      <div className="flex items-center gap-2">
        <ProfileImage image={comment.profile_image} username={comment.username} />
        <span className="wg-txt-primary">{comment.username}</span>
      </div>
      <span className="wg-txt-info">{formatDate(comment.created_at)}</span>
    </div>
  );
};

export default CommentHeader; 