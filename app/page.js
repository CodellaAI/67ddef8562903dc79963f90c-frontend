
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import SidebarCommunities from '@/components/SidebarCommunities';
import CreatePostButton from '@/components/CreatePostButton';
import SortControl from '@/components/SortControl';
import Loading from '@/components/Loading';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('hot');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?sort=${sortBy}`);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-8/12">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Popular Posts</h1>
          <CreatePostButton />
        </div>
        
        <SortControl sortBy={sortBy} onSortChange={handleSortChange} />
        
        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="card text-center py-8">
                <p className="text-reddit-muted">No posts found</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="md:w-4/12">
        <SidebarCommunities />
      </div>
    </div>
  );
}
