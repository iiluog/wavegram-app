import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { BASE_URL } from '@/services/apiSWR';
import { customStyles, utilities } from '@/styles/appTheme';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

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

export const PostContent = ({ post, onSlideChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [api, setApi] = useState(null);

    useEffect(() => {
        if (!api) return;
        api.on('select', () => {
            const newSlide = api.selectedScrollSnap();
            setCurrentSlide(newSlide);
            onSlideChange(newSlide);
        });
    }, [api, onSlideChange]);

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
                                    className={`${customStyles.post.image.dot} ${
                                        index === currentSlide ? customStyles.post.image.dotActive : ''
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
                        <button className={customStyles.post.actions.button}><MessageCircle size={24} /></button>
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