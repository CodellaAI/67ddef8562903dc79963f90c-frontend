
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaReddit } from 'react-icons/fa';
import Loading from '@/components/Loading';

export default function SidebarCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/popular`);
        setCommunities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching communities:', error);
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4">Popular Communities</h2>
      
      {loading ? (
        <Loading small />
      ) : (
        <>
          <ul className="space-y-2">
            {communities.map((community) => (
              <li key={community._id}>
                <Link href={`/r/${community.name}`} className="flex items-center p-2 hover:bg-reddit-hover rounded">
                  <FaReddit className="text-reddit-orange mr-2 text-xl" />
                  <div>
                    <p className="font-medium">r/{community.name}</p>
                    <p className="text-xs text-reddit-muted">{community.memberCount || 0} members</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-reddit-border">
            <Link href="/communities" className="btn-secondary w-full block text-center">
              View All Communities
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
