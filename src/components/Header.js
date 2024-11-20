import React from 'react';
import { customStyles, utilities } from '../styles/appTheme';
import useUserStore from '../stores/userStore';

const Header = ({ onOpenModal, onLogout }) => {
  const { currentUser, getProfileImageUrl } = useUserStore();

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
          {currentUser?.profile_image && (
            <img
              src={getProfileImageUrl(currentUser.profile_image)}
              alt={currentUser.username}
              className="wg-profile-image"
              onClick={onLogout}
              style={{ cursor: 'pointer' }}
            />
          )}
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