
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaShare } from 'react-icons/fa';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';

export default function PostCard({ post }) {
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

  const navigateToPost = () => {
    router.push(`/r/${post.community}/${post._id}`);
  };

  const truncateContent = (content, maxLength = 250) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="card hover:border-gray-500 transition-colors">
      {/* Vote buttons */}
      <div className="flex">
        <div className="flex flex-col items-center pr-2 mr-2 border-r border-reddit-border">
          <button 
            onClick={() => handleVote(1)}
            className={`p-1 ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-300'}`}
          >
            <FaArrowUp />
          </button>
          <span className={`text-xs font-bold my-1 ${
            userVote === 1 ? 'text-reddit-orange' : userVote === -1 ? 'text-blue-500' : 'text-white'
          }`}>
            {votes}
          </span>
          <button 
            onClick={() => handleVote(-1)}
            className={`p-1 ${userVote === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
          >
            <FaArrowDown />
          </button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 cursor-pointer" onClick={navigateToPost}>
          <div className="flex items-center text-xs text-reddit-muted mb-2">
            <Link href={`/r/${post.community}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline mr-1">
              r/{post.community}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by</span>
            <Link href={`/user/${post.author.username}`} onClick={(e) => e.stopPropagation()} className="hover:underline ml-1 mr-1">
              u/{post.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{moment(post.createdAt).fromNow()}</span>
          </div>
          
          <h2 className="text-lg font-medium mb-2">{post.title}</h2>
          
          {post.content && (
            <div className="text-sm text-gray-300 mb-3">
              {truncateContent(post.content)}
            </div>
          )}
          
          <div className="flex items-center text-xs text-reddit-muted mt-2">
            <button className="flex items-center mr-4 hover:bg-reddit-hover p-1 rounded">
              <FaCommentAlt className="mr-1" />
              <span>{post.commentCount || 0} Comments</span>
            </button>
            <button className="flex items-center hover:bg-reddit-hover p-1 rounded">
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
