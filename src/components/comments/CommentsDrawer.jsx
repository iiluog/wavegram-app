import React, { forwardRef } from 'react';
import {
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import CommentsList from './CommentsList';
import CommentInput from './CommentInput';

const CommentsDrawer = forwardRef(({ 
  commentsCount, 
  comments, 
  isLoadingComments, 
  newComment, 
  onCommentChange, 
  onCommentSubmit 
}, ref) => {
  return (
    <DrawerContent ref={ref} className="z-comments w-full max-h-[70vh] bg-background wg-rounded fixed bottom-0 left-0 right-0 outline-none">
      <DrawerHeader className="p-0">
        <DrawerTitle className="px-4 pb-2 wg-txt-primary top-0 w-full flex justify-between items-center">
          <span className="wg-txt-primary">COMMENTI</span>
          <span className="wg-txt-primary">{commentsCount}</span>
        </DrawerTitle>
        <div className="wg-divider"></div>
      </DrawerHeader>
      
      <DrawerDescription asChild role="presentation">
        <div className="flex-1 overflow-y-auto">
          <CommentsList 
            comments={comments} 
            isLoading={isLoadingComments} 
          />
        </div>
      </DrawerDescription>
      
      <DrawerFooter className="border-t">
        <CommentInput 
          value={newComment}
          onChange={onCommentChange}
          onSubmit={onCommentSubmit}
        />
      </DrawerFooter>
    </DrawerContent>
  );
});

// Aggiungiamo un displayName per una migliore debug experience
CommentsDrawer.displayName = 'CommentsDrawer';

export default CommentsDrawer; 