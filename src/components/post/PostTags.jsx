import React from 'react';
import { Badge } from "@/components/ui/badge";
import { UserPlus } from 'lucide-react';
import { customStyles } from '@/styles/appTheme';
import { getProfileImage } from '@/utils/imageUtils';

const PostTags = ({ tags, isOwnPost, onAddTag, onProfileClick }) => {

    const handleProfileClick = () => {
        onProfileClick();
    };

    return (
        <div className="flex gap-2 flex-wrap px-4 py-2">
            
            {tags?.map((tag) => (
                <Badge
                    key={tag.id}
                    className={customStyles.post.tags.badge}
                >
                    <img
                        src={getProfileImage(tag.profile_image, 20)}
                        alt={tag.username}
                        onClick={() => handleProfileClick()}
                        className={customStyles.post.tags.badgeImage}
                    />
                    <span className={customStyles.post.tags.badgeText}>{isOwnPost ? 'me' : tag.username}</span>
                </Badge>
            ))}
            {isOwnPost && (
                <Badge
                    variant="outline"
                    className={customStyles.post.tags.badgeAdd}
                    onClick={onAddTag}
                >
                    <UserPlus size={14} className={customStyles.post.tags.badgeAddIcon}/>
                </Badge>
            )}
        </div>
    );
};

export default PostTags; 