"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';

export default function BlogGrid() {
  const { isAdmin } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?isDraft=false');
      const data = await response.json();
      setPosts(data.slice(0, 3)); // Show only first 3 posts on homepage
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return; // Extra safety check
    
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center text-cyan-400">Loading latest posts...</div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">No Posts Yet</h2>
          <p className="text-cyan-300 mb-6">Start by creating your first blog post!</p>
          <Link
            href="/blog/new"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors font-bold"
          >
            Create Your First Post
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {posts.map((post, idx) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 cursor-pointer group"
            >
              {/* Cover Image */}
              {post.images && post.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Category */}
                <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
                
                <h2 className="text-2xl font-bold mb-2 text-white mt-3 group-hover:text-pink-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-cyan-200 mb-4">
                  {post.excerpt || post.content.slice(0, 100) + '...'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-300">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="text-pink-400 text-sm font-bold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </motion.div>
      
      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:from-cyan-400 hover:to-pink-400 transition-all font-bold text-lg"
          >
            View All Posts
          </Link>
        </motion.div>
      )}
    </section>
  );
} 