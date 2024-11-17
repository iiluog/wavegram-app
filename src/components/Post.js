import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { BASE_URL } from '@/services/apiSWR';
import { customStyles, utilities } from '@/styles/appTheme';
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

const Post = ({ post }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [api, setApi] = useState(null);

    useEffect(() => {
        if (!api) return;

        api.on('select', () => {
            setCurrentSlide(api.selectedScrollSnap());
        });
    }, [api]);

    // Funzione helper per ottenere l'immagine del profilo
    const getProfileImage = (image) => {
        if (image) {
            return `${BASE_URL}/uploads/${image}`;
        }
        return 'https://placehold.co/40x40?text=.';
    };

    // Funzione per formattare la data
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
        <article className={customStyles.post.container}>
            <div className={customStyles.post.divider}></div>

            <div className={`${utilities.flexLayout.between} wg-padding-standard`}>
                <div className={customStyles.post.header.userInfo}>
                    <img
                        src={getProfileImage(post.profile_image)}
                        alt={post.username}
                        className="wg-profile-image"
                    />
                    <span className="wg-txt-primary">{post.username}</span>
                </div>
            </div>
            <Carousel className="w-xl" setApi={setApi}>
                <CarouselContent>
                    {post.images?.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="w-screen aspect-square">
                                <img
                                    src={`${BASE_URL}/uploads/${image}`}
                                    alt=""
                                    className="w-screen aspect-square object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {post.images?.length > 1 && (
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
        </article>
    );
};

export default Post; 