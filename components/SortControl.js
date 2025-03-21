
'use client';

import { FaFire, FaRocket, FaStar, FaClock } from 'react-icons/fa';

export default function SortControl({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'hot', label: 'Hot', icon: <FaFire /> },
    { value: 'new', label: 'New', icon: <FaClock /> },
    { value: 'top', label: 'Top', icon: <FaStar /> },
    { value: 'rising', label: 'Rising', icon: <FaRocket /> },
  ];

  return (
    <div className="flex border border-reddit-border rounded-md bg-reddit-light-dark mb-4">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          className={`flex items-center py-2 px-4 text-sm font-medium ${
            sortBy === option.value
              ? 'text-white bg-reddit-hover'
              : 'text-reddit-muted hover:bg-reddit-hover'
          }`}
          onClick={() => onSortChange(option.value)}
        >
          <span className="mr-2">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
