
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import CommunityHeader from '@/components/CommunityHeader';
import CreatePostButton from '@/components/CreatePostButton';
import SortControl from '@/components/SortControl';
import CommunityInfo from '@/components/CommunityInfo';
import Loading from '@/components/Loading';

export default function CommunityPage({ params }) {
  const { community } = params;
  const [posts, setPosts] = useState([]);
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('hot');

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communityResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${community}`);
        setCommunityData(communityResponse.data);
        
        const postsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/community/${community}?sort=${sortBy}`);
        setPosts(postsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching community data:', error);
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [community, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  if (loading) return <Loading />;

  if (!communityData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Community Not Found</h1>
        <p className="text-reddit-muted">The community r/{community} doesn't exist or has been banned.</p>
      </div>
    );
  }

  return (
    <div>
      <CommunityHeader community={communityData} />
      
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <div className="md:w-8/12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Posts</h2>
            <CreatePostButton community={community} />
          </div>
          
          <SortControl sortBy={sortBy} onSortChange={handleSortChange} />
          
          <div className="space-y-4 mt-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="card text-center py-8">
                <p className="text-reddit-muted">No posts in this community yet</p>
                <button className="btn-primary mt-4">Create the first post</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-4/12">
          <CommunityInfo community={communityData} />
        </div>
      </div>
    </div>
  );
}
