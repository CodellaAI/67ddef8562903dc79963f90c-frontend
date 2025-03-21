
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaReddit } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function CommunityHeader({ community }) {
  const [isJoined, setIsJoined] = useState(community.isJoined || false);
  const [joining, setJoining] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleJoinCommunity = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setJoining(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${community.name}/${isJoined ? 'leave' : 'join'}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setIsJoined(!isJoined);
      setJoining(false);
    } catch (error) {
      console.error('Error joining/leaving community:', error);
      setJoining(false);
    }
  };

  return (
    <div className="bg-reddit-light-dark border border-reddit-border rounded-md overflow-hidden">
      {/* Banner */}
      <div className="h-20 bg-reddit-orange"></div>
      
      {/* Community info */}
      <div className="p-4 flex items-start">
        <div className="bg-reddit-dark rounded-full p-2 -mt-8 border-4 border-reddit-dark">
          <FaReddit className="text-reddit-orange text-5xl" />
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">r/{community.name}</h1>
            <button
              onClick={handleJoinCommunity}
              className={`${isJoined ? 'btn-secondary' : 'btn-primary'}`}
              disabled={joining}
            >
              {joining ? 'Processing...' : isJoined ? 'Joined' : 'Join'}
            </button>
          </div>
          <p className="text-reddit-muted text-sm mt-1">{community.memberCount || 0} members</p>
        </div>
      </div>
      
      {/* Description */}
      {community.description && (
        <div className="px-4 pb-4 border-t border-reddit-border mt-2 pt-2">
          <p>{community.description}</p>
        </div>
      )}
    </div>
  );
}
