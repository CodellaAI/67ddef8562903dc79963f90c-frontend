
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaReddit, FaSearch, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-reddit-light-dark border-b border-reddit-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaReddit className="text-reddit-orange text-3xl" />
            <span className="font-bold text-xl hidden sm:inline">Reddit Clone</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Reddit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-reddit-dark border border-reddit-border rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-reddit-orange"
              />
              <FaSearch className="absolute left-3 top-3 text-reddit-muted" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/submit" className="btn-primary">
                  Create Post
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 hover:bg-reddit-hover p-2 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-reddit-muted" />
                      <span>{user.username}</span>
                    </div>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-reddit-light-dark border border-reddit-border rounded-md shadow-lg">
                      <Link href={`/user/${user.username}`} className="block px-4 py-2 hover:bg-reddit-hover">
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-reddit-hover flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Log In
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 border-t border-reddit-border" ref={menuRef}>
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-white">
                  <span>Logged in as </span>
                  <Link href={`/user/${user.username}`} className="font-bold">
                    {user.username}
                  </Link>
                </div>
                <Link href="/submit" className="block px-4 py-2 hover:bg-reddit-hover">
                  Create Post
                </Link>
                <Link href={`/user/${user.username}`} className="block px-4 py-2 hover:bg-reddit-hover">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-reddit-hover flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 hover:bg-reddit-hover">
                  Log In
                </Link>
                <Link href="/signup" className="block px-4 py-2 hover:bg-reddit-hover">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
