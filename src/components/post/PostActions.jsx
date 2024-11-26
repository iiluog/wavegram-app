import React, { useState } from 'react';
import { Heart, MessageCircle, Send, UserPlusIcon } from 'lucide-react';
import { customStyles, utilities } from '@/styles/appTheme';
import { formatDate } from '@/utils/dateUtils';
import { Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import CommentsDrawer from '../comments/CommentsDrawer';
import IconSpaceship from '@/assets/IconSpaceship.svg';
import IconComment from '@/assets/IconComment.svg';
import { ReactComponent as IconThunder } from '@/assets/IconThunder.svg';
import { commentsApi, likesApi } from '@/services/apiSWR';

const PostActions = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(!!post.is_liked);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  const handleLikeClick = async () => {
    if (isProcessingLike) return;
    
    setIsProcessingLike(true);
    try {
      if (isLiked) {
        await likesApi.delete(post.id);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likesApi.create({ post_id: post.id });
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to process like:', error);
    } finally {
      setIsProcessingLike(false);
    }
  };

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
          <button 
            className={`${customStyles.post.actions.button}`}
            onClick={handleLikeClick}
            disabled={isProcessingLike}
          >
            <IconThunder 
              className={`w-8 h-8`}
              fill={isLiked ? "red" : "var(--primary)"}
            />
          </button>
          
          <Drawer>
            <DrawerTrigger asChild>
              <span 
                className={customStyles.post.actions.button} 
                role="button"
                onClick={handleCommentsClick}
              >
                <img src={IconComment} alt="comments" className="w-8 h-8 " />
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
            <img src={IconSpaceship} alt="share" className="w-8 h-8 " />
          </button>
        </div>
        <div className={customStyles.post.actions.info}>
          <span className="wg-txt-info">{post.location}</span>
          <span className="wg-txt-info">{formatDate(post.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostActions; 