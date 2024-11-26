import React from 'react';
import ProfileImage from '../ui/ProfileImage';
import { formatDate } from '@/utils/dateUtils';
import { customStyles } from '@/styles/appTheme';

const CommentsList = ({ comments, isLoading }) => {
  if (isLoading) {
    return (
      <div className={customStyles.loadingContainer}>
        <div className={customStyles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className="comments-list space-y-4 relative py-4">
      {comments.length === 0 ? (
        <div className="wg-txt-body text-center py-4">Non ci sono ancora commenti</div>
      ) : (
        <>
          
          {[...comments].reverse().map(comment => (
            <div key={comment.id} className="comment-item flex gap-3 px-4 relative pb-4">
              <div className="relative">
                <ProfileImage image={comment.profile_image} username={comment.username} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="wg-txt-body font-bold uppercase " style={{lineHeight: '.7'}}>{comment.username}</span>
                  <span className="wg-txt-info" style={{lineHeight: '.7'}} >{formatDate(comment.created_at)}</span>
                </div>
                <p className="wg-txt-body"style={{lineHeight: '1'}}>{comment.comment}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CommentsList; 