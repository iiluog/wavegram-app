import { BASE_URL } from '../services/apiSWR';

export const getProfileImage = (image, size = 40) => {
    if (image) {
        return `${BASE_URL}/uploads/${image}`;
    }
    return `https://placehold.co/${size}x${size}?text=.`;
}; 