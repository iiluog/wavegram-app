import React from 'react';
import CommentHeader from './CommentHeader';
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
    <div className="comments-list">
      {comments.length === 0 ? (
        <div className="wg-txt-body text-center py-4">Non ci sono ancora commenti</div>
      ) : (
        [...comments].reverse().map(comment => (
          <div key={comment.id} className="comment-item py-2">
            <CommentHeader comment={comment} />
            <div className="wg-txt-body text-secondary text-left px-4 mx-9">
              {comment.comment}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentsList; 