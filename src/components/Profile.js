import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi, postsApi, BASE_URL } from '../services/apiSWR';
import { getProfileImage } from '../utils/imageUtils';
import { customStyles, utilities } from '../styles/appTheme';
import Header from './Header';
import { CircleChevronLeft } from 'lucide-react';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, isLoading, isError } = usersApi.useGetProfile(username);
    const { 
        posts, 
        isLoading: postsLoading, 
        isLoadingMore,
        loadMore,
        isReachingEnd 
    } = postsApi.useGetUserPosts(username);

    const handleBack = () => {
        navigate('/');
    };

    if (isLoading || postsLoading) {
        return <div className={customStyles.errorContainer}>Loading...</div>;
    }

    if (isError) {
        return <div className={customStyles.errorContainer}>Error loading profile</div>;
    }

    return (
        <div className={utilities.container.maxWidth}>
            <Header />
            <div className="wg-divider"></div>
            <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
                <div className="sticky top-0 bg-background z-10">
                    <div className="flex items-center justify-between p-4">
                        <button onClick={handleBack} className="text-primary">
                            <CircleChevronLeft size={24} />
                        </button>
                        <h1 className="wg-txt-primary flex-1 text-center">{user.username}</h1>
                        <div className="w-[24px]"></div>
                    </div>

                    <div className="flex flex-col px-6 pb-6">
                        <div className="flex justify-center">
                            <img
                                src={getProfileImage(user.profile_image)}
                                alt={user.username}
                                className="w-36 h-28 rounded-full object-cover"
                            />
                        </div>

                        <div className="flex justify-center">
                            {user.bio && (
                                <p className="text-sm text-primary mt-2">{user.bio}</p>
                            )}
                        </div>
                    </div>
                    <div className='wg-divider'></div>
                </div>

                <div className="flex-1 overflow-y-scroll p-4">
                    {!posts?.length ? (
                        <div className="flex justify-center items-center h-full text-secondary">
                            Nessun ricordo da mostrare
                        </div>
                    ) : (
                        <>
                            {Object.entries(posts.reduce((acc, post) => {
                                try {
                                    const date = new Date(post.created_at);
                                    if (isNaN(date.getTime())) {
                                        console.warn(`Invalid date for post ${post.id}:`, post.created_at);
                                        return acc;
                                    }

                                    const monday = new Date(date);
                                    monday.setHours(0, 0, 0, 0);
                                    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));

                                    const key = monday.toISOString().split('T')[0];
                                    if (!acc[key]) {
                                        acc[key] = [];
                                    }
                                    acc[key].push(post);
                                    return acc;
                                } catch (error) {
                                    console.error('Error processing date for post:', post);
                                    return acc;
                                }
                            }, {})).sort((a, b) => new Date(b[0]) - new Date(a[0]))
                                .map(([dateKey, datePosts]) => {
                                    const monday = new Date(dateKey);
                                    const day = monday.getDate();
                                    const month = monday.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase();
                                    const year = monday.getFullYear();

                                    return (
                                        <div key={dateKey} className="mb-12">
                                            <div className="grid grid-cols-[80px_1fr] items-start ">
                                                <div className="text-primary flex flex-col items-center mr-4">
                                                    <div className="text-4xl font-bold leading-none">{day}</div>
                                                    <div className="text-sm font-medium">{month}</div>
                                                    <div className="text-sm font-medium">{year}</div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {datePosts.map((post) => (
                                                        <div key={post.id} className="aspect-square">
                                                            <img
                                                                src={`${BASE_URL}/uploads/${post.images[0]}`}
                                                                alt={`Post by ${user.username}`}
                                                                className="w-full h-full object-cover wg-rounded"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            
                            {!isReachingEnd && (
                                <div className="flex justify-center mt-8 mb-4">
                                    <button 
                                        onClick={loadMore}
                                        disabled={isLoadingMore}
                                        className="wg-btn-primary text-black px-6 py-2"
                                    >
                                        {isLoadingMore ? 'Caricamento...' : 'Carica altri ricordi'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 