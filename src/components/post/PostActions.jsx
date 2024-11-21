import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { customStyles, utilities } from '@/styles/appTheme';
import { formatDate } from '@/utils/dateUtils';
import { Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import CommentsDrawer from '../comments/CommentsDrawer';
import { commentsApi } from '@/services/apiSWR';

const PostActions = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [newComment, setNewComment] = useState('');

  async function handleCommentsClick() {
    setIsLoadingComments(true);
    try {
      const response = await commentsApi.getAll(post.id);
      setComments(response || []);
      setCommentsCount(response?.length || 0);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  }

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await commentsApi.create({
        post_id: post.id,
        comment: newComment
      });
      
      // Refresh comments
      const updatedComments = await commentsApi.getAll(post.id);
      setComments(updatedComments || []);
      setCommentsCount(updatedComments?.length || 0);
      
      // Clear input
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <div className={customStyles.post.actions.wrapper}>
      <div className={utilities.flexLayout.between}>
        <div className={customStyles.post.actions.buttons}>
          <button className={customStyles.post.actions.button}>
            <Heart size={24} />
          </button>
          
          <Drawer>
            <DrawerTrigger asChild>
              <span 
                className={customStyles.post.actions.button} 
                role="button"
                onClick={handleCommentsClick}
              >
                <MessageCircle size={24} />
              </span>
            </DrawerTrigger>
            <DrawerPortal>
              <DrawerOverlay className="fixed z-overlay inset-0 bg-black/40" />
              <CommentsDrawer
                commentsCount={commentsCount}
                comments={comments}
                isLoadingComments={isLoadingComments}
                newComment={newComment}
                onCommentChange={(e) => setNewComment(e.target.value)}
                onCommentSubmit={handleCreateComment}
              />
            </DrawerPortal>
          </Drawer>

          <button className={customStyles.post.actions.button}>
            <Send size={24} />
          </button>
        </div>
        <div className={customStyles.post.actions.info}>
          <span className="wg-txt-info">BigRock</span>
          <span className="wg-txt-info">{formatDate(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostActions; 