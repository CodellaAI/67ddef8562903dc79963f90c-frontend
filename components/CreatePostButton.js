
'use client';

import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function CreatePostButton({ community = '' }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/submit');
      return;
    }
    
    if (community) {
      router.push(`/submit?community=${community}`);
    } else {
      router.push('/submit');
    }
  };

  return (
    <button
      onClick={handleCreatePost}
      className="btn-primary flex items-center"
    >
      <FaPlus className="mr-2" />
      Create Post
    </button>
  );
}
