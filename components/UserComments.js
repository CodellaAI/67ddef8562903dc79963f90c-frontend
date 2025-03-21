
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import { FaCommentAlt } from 'react-icons/fa';
import Loading from '@/components/Loading';

export default function UserComments({ username }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/user/${username}`);
        setComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user comments:', error);
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [username]);

  if (loading) return <Loading />;

  if (comments.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-reddit-muted">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="card">
          <div className="flex items-center text-xs text-reddit-muted mb-2">
            <FaCommentAlt className="mr-2" />
            <span>
              Comment on{' '}
              <Link href={`/r/${comment.post.community}/${comment.post._id}`} className="hover:underline text-reddit-orange">
                {comment.post.title}
              </Link>
            </span>
            <span className="mx-1">•</span>
            <Link href={`/r/${comment.post.community}`} className="hover:underline">
              r/{comment.post.community}
            </Link>
            <span className="mx-1">•</span>
            <span>{moment(comment.createdAt).fromNow()}</span>
          </div>
          
          <div className="text-sm mb-2">{comment.content}</div>
          
          <Link 
            href={`/r/${comment.post.community}/${comment.post._id}#comment-${comment._id}`}
            className="text-xs text-reddit-muted hover:underline"
          >
            View full context
          </Link>
        </div>
      ))}
    </div>
  );
}
