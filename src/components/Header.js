import React from 'react';
import { customStyles, utilities } from '../styles/appTheme';
import useUserStore from '../stores/userStore';
import ProfileImage from './ui/ProfileImage';

const Header = ({ onOpenModal }) => {
    const { currentUser } = useUserStore();

    const getFormattedTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}${ampm}`;
    };

    return (
        <div className={customStyles.header.base}>
            <div className={utilities.flexLayout.between}>
                <span className="wg-txt-primary lowercase">
                    {new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }).replace(/\//g, '.')} - {getFormattedTime()}
                </span>
                <div className={utilities.flexLayout.center}>
                    <ProfileImage
                        image={currentUser?.profile_image}
                        username={currentUser?.username}
                    />
                    <span
                        className="text-3xl ml-2 font-bold text-textPrimary cursor-pointer hover:opacity-80"
                        onClick={onOpenModal}
                    >
                        +
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Header; 