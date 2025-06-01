'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { useAdminAuth } from '@/components/AdminAuthContext';
import Comments from '@/components/Comments';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin } = useAdminAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchPost();
    }
  }, [resolvedParams.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog?id=${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin || !post) return;
    
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/blog?id=${post.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      router.push('/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  // Function to render content with clickable links
  const renderContentWithLinks = (text: string) => {
    // Simple markdown link parser: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-pink-400 underline transition-colors font-medium"
        >
          {match[1]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.map((part, index) => (
      <span key={index}>{part}</span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-20">
        <div className="text-cyan-400 text-xl">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-cyan-300 hover:text-pink-400 underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Admin Controls */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex gap-3 justify-end"
          >
            <Link
              href={`/blog/edit/${post.id}`}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors border border-pink-500/30"
            >
              Delete Post
            </button>
          </motion.div>
        )}

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-cyan-500/20">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-sm rounded-full">
                {post.category}
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-cyan-400 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="text-cyan-300 text-sm">
              Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="ml-4">
                  Updated on {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="p-8 border-b border-cyan-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.images.map((image, index) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    src={image}
                    alt={`${post.title} - Image ${index + 1}`}
                    className="w-full rounded-lg shadow-lg border border-cyan-500/20"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="text-cyan-300 leading-relaxed text-lg space-y-4">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {renderContentWithLinks(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <Comments postId={post.id} />

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
          >
            ← Back to All Posts
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 