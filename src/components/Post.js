import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { BASE_URL, commentsApi } from '@/services/apiSWR';
import { customStyles, utilities } from '@/styles/appTheme';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"


import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerDescription,
    DrawerTitle,
    DrawerFooter,
    DrawerPortal,
    DrawerOverlay
} from "@/components/ui/drawer"

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
};

export const PostHeader = ({ post, currentSlide, totalSlides }) => {
    const getProfileImage = (image) => {
        if (image) {
            return `${BASE_URL}/uploads/${image}`;
        }
        return 'https://placehold.co/40x40?text=.';
    };

    return (
        <>
            <div className="wg-divider"></div>
            <div className={`${utilities.flexLayout.between} wg-padding-standard`}>
                <div className={customStyles.post.header.userInfo}>
                    <img
                        src={getProfileImage(post.profile_image)}
                        alt={post.username}
                        className="wg-profile-image"
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


export const CommentHeader = ({ comment }) => {
    const getProfileImage = (image) => {
        if (image) {
            return `${BASE_URL}/uploads/${image}`;
        }
        return 'https://placehold.co/40x40?text=.';
    };

    return (
        <>
            <div className={`${utilities.flexLayout.between} px-4`}>
                <div className={customStyles.post.header.userInfo}>
                    <img
                        src={getProfileImage(comment.profile_image)}
                        alt={comment.username}
                        className="wg-profile-image"
                    />
                    <span className="wg-txt-primary">{comment.username}</span>
                </div>
                <span className="wg-txt-info">{formatDate(comment.created_at)}</span>
            </div>
        </>
    );
};

export const PostContent = ({ post, onSlideChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [api, setApi] = useState(null);
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

    useEffect(() => {
        if (!api) return;
        api.on('select', () => {
            const newSlide = api.selectedScrollSnap();
            setCurrentSlide(newSlide);
            onSlideChange(newSlide);
        });
    }, [api, onSlideChange]);

    return (
        <>
            <Carousel className="w-xl" setApi={setApi}>
                <CarouselContent>
                    {post.images?.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="w-screen px-4 aspect-square">
                                <img
                                    src={`${BASE_URL}/uploads/${image}`}
                                    alt=""
                                    className="h-full w-full wg-rounded object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                { // dos are disabled at the moment
                    false && post.images?.length > 1 && (
                        <>
                            <div className={customStyles.post.image.dots}>
                                {post.images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`${customStyles.post.image.dot} ${index === currentSlide ? customStyles.post.image.dotActive : ''
                                            }`}
                                        onClick={() => api?.scrollTo(index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
            </Carousel>

            <div className={customStyles.post.actions.wrapper}>
                <div className={utilities.flexLayout.between}>
                    <div className={customStyles.post.actions.buttons}>
                        <button className={customStyles.post.actions.button}><Heart size={24} /></button>
                        <Drawer>
                            <DrawerTrigger><MessageCircle onClick={handleCommentsClick} size={24} /></DrawerTrigger>
                            <DrawerPortal>
                                <DrawerOverlay className="fixed z-overlay inset-0 bg-black/40" />
                                <DrawerContent className="z-comments w-full max-h-[70vh] bg-background wg-rounded fixed bottom-0 left-0 right-0 outline-none">
                                    <DrawerHeader className="p-0">
                                        <DrawerTitle className="px-4 pb-2 wg-txt-primary top-0 w-full flex justify-between items-center">
                                            <span className="wg-txt-primary">COMMENTI</span>
                                            <span className="wg-txt-primary">{commentsCount}</span>
                                        </DrawerTitle>
                                        <div className="wg-divider"></div>

                                    </DrawerHeader>
                                    <DrawerDescription className="overflow-y-auto">

                                        {isLoadingComments ? (
                                            <div className={customStyles.loadingContainer}>
                                                <div className={customStyles.loadingSpinner}></div>
                                            </div>
                                        ) : (
                                            <div className="comments-list">
                                                {comments.length === 0 ? (
                                                    <p className="wg-txt-body text-center py-4">Non ci sono ancora commenti</p>
                                                ) : (
                                                    comments.map(comment => (
                                                        <div key={comment.id} className="comment-item py-2">
                                                            <CommentHeader comment={comment} />
                                                            <p className="wg-txt-body text-secondary text-left px-4 mx-9">{comment.comment}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </DrawerDescription>
                                    <DrawerFooter className="border-t">
                                        <div className="flex items-center gap-2 m-4 px-4 border-2 border-secondary rounded-full">
                                            <input 
                                                type="text" 
                                                placeholder="Scrivi un commento..." 
                                                className="flex-1 bg-transparent text-primary wg-txt-body focus:outline-none pt-2 leading-none"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleCreateComment();
                                                    }
                                                }}
                                                enterKeyHint="send"
                                            />
                                            <button 
                                                className="wg-txt-primary text-secondary font-semibold pb-1 leading-none"
                                                onClick={handleCreateComment}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </DrawerFooter>
                                </DrawerContent>

                            </DrawerPortal>
                        </Drawer>
                        <button className={customStyles.post.actions.button}><Send size={24} /></button>

                    </div>
                    <div className={customStyles.post.actions.info}>
                        <span className="wg-txt-info">BigRock</span>
                        <span className="wg-txt-info">{formatDate(post.created_at)}</span>
                    </div>
                </div>

                <div>
                    <p className="wg-txt-body">
                        {post.description}
                    </p>
                </div>
            </div>
        </>
    );
};

const Post = ({ post }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <article className={customStyles.post.container}>
            <PostHeader
                post={post}
                currentSlide={currentSlide}
                totalSlides={post.images?.length || 0}
            />
            <PostContent
                post={post}
                onSlideChange={setCurrentSlide}
            />
        </article>
    );
};

export default Post; 