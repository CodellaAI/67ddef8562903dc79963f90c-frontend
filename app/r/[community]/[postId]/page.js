
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import PostDetail from '@/components/PostDetail';
import CommentSection from '@/components/CommentSection';
import Loading from '@/components/Loading';

export default function PostPage({ params }) {
  const { community, postId } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const goBack = () => {
    router.back();
  };

  if (loading) return <Loading />;

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-reddit-muted">The post you're looking for doesn't exist or has been removed.</p>
        <button onClick={goBack} className="btn-secondary mt-4 flex items-center mx-auto">
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={goBack} className="btn-secondary mb-4 flex items-center">
        <FaArrowLeft className="mr-2" /> Go Back
      </button>
      
      <div className="card mb-6">
        <PostDetail post={post} />
      </div>
      
      <CommentSection postId={postId} />
    </div>
  );
}
