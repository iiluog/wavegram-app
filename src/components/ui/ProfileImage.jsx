import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../services/apiSWR';


const ProfileImage = ({ image, username, size = 40 }) => {

    const navigate = useNavigate();
    const getProfileImage = (image) => {
        if (image) {
      return `${BASE_URL}/uploads/${image}`;
    }
    return `https://placehold.co/${size}x${size}?text=.`;
  };


  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
};

  return (
    <img
      src={getProfileImage(image)}
      alt={username}
      onClick={handleProfileClick}
      className="wg-profile-image"
    />
  );
};

export default ProfileImage; 