
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import PostCard from '@/components/PostCard';
import UserComments from '@/components/UserComments';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';

export default function UserProfile({ params }) {
  const { username } = params;
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const router = useRouter();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);
        setUserData(userResponse.data);
        
        const postsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/${username}`);
        setPosts(postsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <Loading />;

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-reddit-muted">The user u/{username} doesn't exist or has been banned.</p>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser.username === username;

  return (
    <div>
      <div className="card mb-6">
        <div className="flex items-center">
          <div className="mr-4">
            {userData.avatar ? (
              <Image 
                src={userData.avatar} 
                alt={userData.username} 
                width={80} 
                height={80} 
                className="rounded-full"
              />
            ) : (
              <FaUserCircle size={80} className="text-reddit-muted" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">u/{userData.username}</h1>
            <p className="text-reddit-muted">
              Joined {new Date(userData.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1">Karma: {userData.karma || 0}</p>
          </div>
          
          {isCurrentUser && (
            <button 
              className="btn-secondary ml-auto"
              onClick={() => router.push('/settings')}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6 border-b border-reddit-border">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'posts' ? 'text-white border-b-2 border-reddit-orange' : 'text-reddit-muted'}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'comments' ? 'text-white border-b-2 border-reddit-orange' : 'text-reddit-muted'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
      </div>
      
      {activeTab === 'posts' ? (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="card text-center py-8">
              <p className="text-reddit-muted">No posts yet</p>
            </div>
          )}
        </div>
      ) : (
        <UserComments username={username} />
      )}
    </div>
  );
}
