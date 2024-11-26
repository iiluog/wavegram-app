import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { customStyles, utilities } from '../styles/appTheme';
import { usersApi } from '../services/apiSWR';
import useUserStore from '../stores/userStore';
import { getProfileImage } from '../utils/imageUtils';
import { CircleChevronLeft } from 'lucide-react';
import Header from './Header';

const EditProfile = () => {
    const { currentUser, updateUser } = useUserStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        bio: currentUser?.bio || ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(
        currentUser?.profile_image ? getProfileImage(currentUser.profile_image) : null
    );
    const [errors, setErrors] = useState({});

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    image: "L'immagine deve essere inferiore a 5MB"
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileImage(file);
            setErrors(prev => ({ ...prev, image: null }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Aggiungi i campi solo se sono stati modificati
            if (formData.first_name !== currentUser.first_name) {
                formDataToSend.append('first_name', formData.first_name);
            }
            if (formData.last_name !== currentUser.last_name) {
                formDataToSend.append('last_name', formData.last_name);
            }
            if (formData.bio !== currentUser.bio) {
                formDataToSend.append('bio', formData.bio);
            }
            if (profileImage) {
                formDataToSend.append('profile_image', profileImage);
            }

            const { user: updatedUser } = await usersApi.update(formDataToSend);
            updateUser(updatedUser);
            navigate(`/profile/${currentUser.username}`);
        } catch (error) {
            console.error('Aggiornamento fallito:', error);
            setErrors(prev => ({
                ...prev,
                submit: "Errore durante l'aggiornamento del profilo"
            }));
        }
    };

    const handleBack = () => {
        navigate(`/profile/${currentUser.username}`);
    };

    return (
        <div >
            <Header />
            <div className="sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between p-4">
                    <button onClick={handleBack} className="text-primary">
                        <CircleChevronLeft size={24} />
                    </button>
                    <h1 className="wg-txt-primary flex-1 text-center">Modifica Profilo</h1>
                    <div className="w-[24px]"></div>
                </div>
            </div>
            <div className={`${customStyles.formContainer} min-h-0`}>
                <div className={utilities.container.maxWidth}>
                    <div className={`${utilities.container.maxWidthMd}`}>
                    <div className="m-8 flex justify-center">
                        <div className="relative cursor-pointer" onClick={handleImageClick}>
                            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-dotted ${errors.image ? 'border-red-500' : 'border-gray-400'
                                }`}>
                                {profileImagePreview ? (
                                    <img
                                        src={profileImagePreview}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#1D1D1D] rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    {errors.image && (
                        <p className="text-error text-center">{errors.image}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Nome"
                                className="wg-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Cognome"
                                className="wg-input"
                            />
                        </div>

                        <div>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Bio"
                                className="wg-input min-h-[100px]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="wg-button-primary"
                        >
                            Salva modifiche
                        </button>

                        {errors.submit && (
                            <p className="text-error text-center">{errors.submit}</p>
                        )}
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
};

export default EditProfile; 