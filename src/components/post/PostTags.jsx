import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2 } from 'lucide-react';
import { customStyles } from '@/styles/appTheme';
import { getProfileImage } from '@/utils/imageUtils';
import TagInput from '@/components/post/TagInput';
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerPortal,
    DrawerOverlay,
    DrawerFooter,
    DrawerDescription,
} from "@/components/ui/drawer";

const PostTags = ({ tags, isOwnPost, onAddTag, onProfileClick, postId, onRemoveTag }) => {
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (username) => {
        if (username) {
            onAddTag(username);
            setTagInput('');
        }
    };

    const handleRemoveTag = (taggedUserId) => {
        onRemoveTag(taggedUserId);
    };

    const handleProfileClick = (username) => {
        onProfileClick(username);
    };

    return (
        <div className="flex gap-1.5 flex-wrap px-4 py-2">
            {tags?.map((tag) => (
                <Badge
                    key={tag.id}
                    className={customStyles.post.tags.badge}
                >
                    <img
                        src={getProfileImage(tag.profile_image, 20)}
                        alt={tag.username}
                        onClick={() => handleProfileClick(tag.username)}
                        className={customStyles.post.tags.badgeImage}
                    />
                    <span className={customStyles.post.tags.badgeText}>
                        {tag.username}
                    </span>
                </Badge>
            ))}

            {isOwnPost && (
                <Drawer>
                    <DrawerTrigger asChild>
                        <Badge
                            variant="outline"
                            className={customStyles.post.tags.badgeAdd}
                        >
                            <UserPlus size={14} className={customStyles.post.tags.badgeAddIcon} />
                        </Badge>
                    </DrawerTrigger>
                    <DrawerPortal>
                        <DrawerOverlay className="fixed z-overlay inset-0 bg-black/40" />
                        <DrawerContent className="z-comments w-full h-[70%] bg-background wg-rounded fixed bottom-0 left-0 right-0 outline-none">
                            <DrawerHeader className="p-0">
                                <DrawerTitle className="px-4 wg-txt-primary top-0 w-full flex justify-between items-center">
                                    <span className="wg-txt-primary">TAG</span>
                                    <span className="wg-txt-primary">{tags.length}</span>
                                </DrawerTitle>
                                <div className="wg-divider"></div>
                            </DrawerHeader>

                            <DrawerFooter className="border-t p-4">
                                <TagInput
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onSubmit={handleSubmit}
                                    postId={postId}
                                />
                            </DrawerFooter>
                            
                            <DrawerDescription asChild>
                                <div className="flex-1 overflow-y-auto px-4 py-2">
                                    {tags.map((tag) => (
                                        <div 
                                            key={tag.id} 
                                            className="flex items-center justify-between mb-6 hover:bg-accent rounded-md"
                                        >
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={getProfileImage(tag.profile_image, 32)}
                                                    alt={tag.username}
                                                    className="w-8 h-8 rounded-full wg-profile-image"
                                                />
                                                <span className="text-xl text-primary uppercase">
                                                    {tag.username}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTag(tag.tagged_user_id)}
                                                className="text-secondary hover:bg-destructive/10 p-1 rounded-full"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </DrawerDescription>

                        </DrawerContent>
                    </DrawerPortal>
                </Drawer>
            )}
        </div>
    );
};

export default PostTags; 