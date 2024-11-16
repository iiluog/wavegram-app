import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { BASE_URL } from '../services/apiSWR';
import { customStyles, utilities } from '../styles/appTheme';

const Post = ({ post }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Funzione helper per ottenere la prima immagine del post
    const getPostImage = (images) => {
        if (images && images.length > 0) {
            return `${BASE_URL}/uploads/${images[currentImageIndex]}`;
        }
        return 'https://placehold.co/400x400?text=Not+available';
    };

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

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // Minima distanza per lo swipe

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentImageIndex < (post.images?.length - 1)) {
                // Swipe verso sinistra
                setCurrentImageIndex(prev => prev + 1);
            } else if (diff < 0 && currentImageIndex > 0) {
                // Swipe verso destra
                setCurrentImageIndex(prev => prev - 1);
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
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
                <span className="wg-txt-primary">
                    {currentImageIndex + 1}/{post.images?.length || 0}
                </span>
            </div>

            <div className={customStyles.post.image.wrapper}>
                <div 
                    className={customStyles.post.image.carousel}
                    style={{
                        display: 'flex',
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    {post.images?.map((image, index) => (
                        <img
                            key={index}
                            src={`${BASE_URL}/uploads/${image}`}
                            alt=""
                            className={customStyles.post.image.img}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{ flexShrink: 0, width: '100%' }}
                        />
                    ))}
                </div>
                {post.images?.length > 1 && (
                    <div className={customStyles.post.image.dots}>
                        {post.images.map((_, index) => (
                            <span
                                key={index}
                                className={`${customStyles.post.image.dot} ${
                                    index === currentImageIndex ? customStyles.post.image.dotActive : ''
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

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