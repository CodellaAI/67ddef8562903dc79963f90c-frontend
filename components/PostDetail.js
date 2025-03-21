
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaShare } from 'react-icons/fa';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';

export default function PostDetail({ post }) {
  const [votes, setVotes] = useState(post.upvotes - post.downvotes);
  const [userVote, setUserVote] = useState(post.userVote || 0);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleVote = async (voteValue) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // If user clicks the same vote button, remove their vote
    const newVoteValue = userVote === voteValue ? 0 : voteValue;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/vote`,
        { vote: newVoteValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      const voteChange = newVoteValue - userVote;
      setVotes(votes + voteChange);
      setUserVote(newVoteValue);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div>
      {/* Post metadata */}
      <div className="flex items-center text-xs text-reddit-muted mb-3">
        <Link href={`/r/${post.community}`} className="font-medium hover:underline mr-1">
          r/{post.community}
        </Link>
        <span className="mx-1">•</span>
        <span>Posted by</span>
        <Link href={`/user/${post.author.username}`} className="hover:underline ml-1 mr-1">
          u/{post.author.username}
        </Link>
        <span className="mx-1">•</span>
        <span>{moment(post.createdAt).fromNow()}</span>
      </div>
      
      {/* Post title and content */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      
      <div className="text-base mb-6 whitespace-pre-line">
        {post.content}
      </div>
      
      {/* Vote and action buttons */}
      <div className="flex items-center border-t border-b border-reddit-border py-2 my-4">
        <div className="flex items-center mr-6">
          <button 
            onClick={() => handleVote(1)}
            className={`p-2 ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-300'}`}
          >
            <FaArrowUp />
          </button>
          <span className={`mx-2 font-bold ${
            userVote === 1 ? 'text-reddit-orange' : userVote === -1 ? 'text-blue-500' : 'text-white'
          }`}>
            {votes}
          </span>
          <button 
            onClick={() => handleVote(-1)}
            className={`p-2 ${userVote === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
          >
            <FaArrowDown />
          </button>
        </div>
        
        <button className="flex items-center text-reddit-muted hover:bg-reddit-hover p-2 rounded">
          <FaShare className="mr-1" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
