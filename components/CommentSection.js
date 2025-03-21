
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import Comment from '@/components/Comment';
import Loading from '@/components/Loading';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/post/${postId}`);
        setComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const onSubmitComment = async (data) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/r/${postId}`);
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        {
          postId,
          content: data.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Add the new comment to the list
      setComments([response.data, ...comments]);
      reset();
      setSubmitting(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      setSubmitting(false);
    }
  };

  const handleReply = (newComment) => {
    // Update the comments list with the new reply
    setComments(prevComments => {
      // Create a new array to avoid mutating the state directly
      const updatedComments = [...prevComments];
      
      // Find the parent comment and add the reply
      const findAndAddReply = (comments) => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i]._id === newComment.parentId) {
            if (!comments[i].replies) {
              comments[i].replies = [];
            }
            comments[i].replies.unshift(newComment);
            return true;
          }
          if (comments[i].replies && findAndAddReply(comments[i].replies)) {
            return true;
          }
        }
        return false;
      };
      
      findAndAddReply(updatedComments);
      return updatedComments;
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      
      <div className="card mb-6">
        <form onSubmit={handleSubmit(onSubmitComment)}>
          <textarea
            {...register('content', { 
              required: 'Comment cannot be empty' 
            })}
            className="input min-h-[100px]"
            placeholder={isAuthenticated ? "What are your thoughts?" : "Log in to leave a comment"}
            disabled={!isAuthenticated || submitting}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
          
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!isAuthenticated || submitting}
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              postId={postId}
              onReplyAdded={handleReply}
            />
          ))
        ) : (
          <div className="card text-center py-6">
            <p className="text-reddit-muted">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
