
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';

export default function SubmitPost() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated && !loading) {
      router.push('/login?redirect=/submit');
      return;
    }

    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities`);
        setCommunities(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/submit');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      router.push(`/r/${data.community}/${response.data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a post</h1>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Community</label>
          <select 
            {...register('community', { required: 'Please select a community' })}
            className="input"
          >
            <option value="">Select a community</option>
            {communities.map(community => (
              <option key={community._id} value={community.name}>
                r/{community.name}
              </option>
            ))}
          </select>
          {errors.community && (
            <p className="text-red-500 text-sm mt-1">{errors.community.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register('title', { 
              required: 'Title is required',
              maxLength: { value: 300, message: 'Title cannot exceed 300 characters' }
            })}
            className="input"
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            {...register('content', { 
              required: 'Content is required' 
            })}
            className="input min-h-[200px]"
            placeholder="Text (optional)"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
