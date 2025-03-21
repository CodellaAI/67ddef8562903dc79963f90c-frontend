
'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa';
import moment from 'moment';
import { useAuth } from '@/context/AuthContext';

export default function Comment({ comment, postId, onReplyAdded, depth = 0 }) {
  const [votes, setVotes] = useState(comment.upvotes - comment.downvotes);
  const [userVote, setUserVote] = useState(comment.userVote || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isAuthenticated, user } = useAuth();

  const handleVote = async (voteValue) => {
    if (!isAuthenticated) return;

    // If user clicks the same vote button, remove their vote
    const newVoteValue = userVote === voteValue ? 0 : voteValue;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment._id}/vote`,
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
      console.error('Error voting on comment:', error);
    }
  };

  const onSubmitReply = async (data) => {
    if (!isAuthenticated) return;

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        {
          postId,
          parentId: comment._id,
          content: data.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Notify parent component about the new reply
      onReplyAdded(response.data);
      setIsReplying(false);
      reset();
      setSubmitting(false);
    } catch (error) {
      console.error('Error posting reply:', error);
      setSubmitting(false);
    }
  };

  // Limit the nesting depth for replies
  const maxDepth = 4;

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l border-reddit-border' : ''}`}>
      <div className="card">
        <div className="flex items-center text-xs text-reddit-muted mb-2">
          <Link href={`/user/${comment.author.username}`} className="font-medium hover:underline mr-1">
            u/{comment.author.username}
          </Link>
          <span className="mx-1">•</span>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
        
        <div className="text-sm mb-3">
          {comment.content}
        </div>
        
        <div className="flex items-center text-xs text-reddit-muted">
          <div className="flex items-center mr-4">
            <button 
              onClick={() => handleVote(1)}
              className={`p-1 ${userVote === 1 ? 'text-reddit-orange' : 'hover:text-gray-300'}`}
              disabled={!isAuthenticated}
            >
              <FaArrowUp />
            </button>
            <span className={`mx-1 ${
              userVote === 1 ? 'text-reddit-orange' : userVote === -1 ? 'text-blue-500' : ''
            }`}>
              {votes}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={`p-1 ${userVote === -1 ? 'text-blue-500' : 'hover:text-gray-300'}`}
              disabled={!isAuthenticated}
            >
              <FaArrowDown />
            </button>
          </div>
          
          {depth < maxDepth && isAuthenticated && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center hover:bg-reddit-hover p-1 rounded"
            >
              <FaReply className="mr-1" />
              <span>Reply</span>
            </button>
          )}
        </div>
        
        {isReplying && (
          <div className="mt-3">
            <form onSubmit={handleSubmit(onSubmitReply)}>
              <textarea
                {...register('content', { 
                  required: 'Reply cannot be empty' 
                })}
                className="input min-h-[80px]"
                placeholder="What are your thoughts?"
                disabled={submitting}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
              
              <div className="flex justify-end mt-2 space-x-2">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsReplying(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply._id} 
              comment={reply} 
              postId={postId}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
