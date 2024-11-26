import React from 'react';
import { customStyles, utilities } from '../styles/appTheme';
import useUserStore from '../stores/userStore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileImage from './ui/ProfileImage';
import { UserPen, UserX } from 'lucide-react';

const Header = ({ onOpenModal, isOwnPage }) => {
    const { currentUser } = useUserStore();
    const { logout: authLogout } = useAuth();
    const { logout: storeLogout } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const getFormattedTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}${ampm}`;
    };

    const handleLogout = () => {
        authLogout(); // Logout dal context di autenticazione
        storeLogout(); // Logout dallo store
        navigate('/login'); // Usa navigate invece di window.location
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
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
                    {isOwnPage ? (
                        <>
                            <button
                                onClick={handleEditProfile}
                                className="text-textPrimary hover:opacity-80 font-medium mr-3 mt-1"
                            >
                                <UserPen />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-textPrimary hover:opacity-80 font-medium mt-1"
                            >
                                <UserX />
                            </button>
                        </>
                    ) : isHomePage && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header; 