import React from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { BASE_URL } from '../services/apiSWR';
import { customStyles } from '../styles/appTheme';

const Post = ({ post }) => {
    // Funzione helper per ottenere la prima immagine del post
    const getPostImage = (images) => {
        if (images && images.length > 0) {
            return `${BASE_URL}/uploads/${images[0]}`;
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

    return (
        <article className={customStyles.post.container}>
            <div className={customStyles.post.divider}></div>

            <div className={customStyles.post.header.wrapper}>
                <div className={customStyles.post.header.userInfo}>
                    <img
                        src={getProfileImage(post.profile_image)}
                        alt={post.username}
                        className={customStyles.profileImage}
                    />
                    <span className="wg-txt-primary">{post.username}</span>
                </div>
                <span className="wg-txt-primary">1/{post.images?.length || 0}</span>
            </div>

            <div className={customStyles.post.image.wrapper}>
                <img
                    src={getPostImage(post.images)}
                    alt=""
                    className={customStyles.post.image.img}
                />
            </div>

            <div className={customStyles.post.actions.wrapper}>
                <div className={customStyles.post.actions.container}>
                    <div className={customStyles.post.actions.buttons}>
                        <button className={customStyles.post.actions.button}><Heart size={24} /></button>
                        <button className={customStyles.post.actions.button}><MessageCircle size={24} /></button>
                        <button className={customStyles.post.actions.button}><Send size={24} /></button>
                    </div>
                    <div className={customStyles.post.actions.info}>
                        <span className="font-sm">BigRock</span>
                        <span className="text-sm">{formatDate(post.created_at)}</span>
                    </div>
                </div>

                <div className="text-sm">
                    <p className="wg-txt-body">
                        {post.description}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default Post; 