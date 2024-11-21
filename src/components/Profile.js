import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usersApi, postsApi } from '../services/apiSWR';
import { getProfileImage } from '../utils/imageUtils';
import { customStyles, utilities } from '../styles/appTheme';
import { BASE_URL } from '../services/apiSWR';
import Header from './Header';
import { CircleChevronLeft } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isError } = usersApi.useGetProfile(username);
  const { posts, isLoading: postsLoading } = postsApi.useGetUserPosts(username);

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
      <div className="flex flex-col h-screen bg-background">
        {/* Sub Navigation */}
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="text-primary">
            <CircleChevronLeft size={24} />
          </button>
          <h1 className="wg-txt-primary text-lg flex-1 text-center">{user.username}</h1>
          <div className="w-[24px]"></div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col px-6 pb-6">
          {/* Profile Image and Stats */}
          <div className="flex justify-center">
            <img
              src={getProfileImage(user.profile_image)}
              alt={user.username}
              className="w-32 h-24 rounded-full object-cover"
            />
          </div>

          {/* Bio Section */}
          <div className="flex justify-center">
            {user.bio && (
              <p className="text-sm text-primary mt-2">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 bg-background px-4">
          <div className="grid grid-cols-2 gap-2">
            {posts.posts?.map((post) => (
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
    </div>
  );
};

export default Profile; 