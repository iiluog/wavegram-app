import { useNavigate } from 'react-router-dom';
import { getProfileImage } from '../../utils/imageUtils';

const ProfileImage = ({ image, username }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(`/profile/${username}`);
    };

    return (
        <img
            src={getProfileImage(image, 40)}
            alt={username}
            onClick={handleProfileClick}
            className="wg-profile-image"
        />
    );
};

export default ProfileImage; 