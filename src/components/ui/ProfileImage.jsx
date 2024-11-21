import React from 'react';
import { BASE_URL } from '@/services/apiSWR';

const ProfileImage = ({ image, username, size = 40 }) => {
  const getProfileImage = (image) => {
    if (image) {
      return `${BASE_URL}/uploads/${image}`;
    }
    return `https://placehold.co/${size}x${size}?text=.`;
  };

  return (
    <img
      src={getProfileImage(image)}
      alt={username}
      className="wg-profile-image"
    />
  );
};

export default ProfileImage; 