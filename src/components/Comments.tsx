'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from './AdminAuthContext';

interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { isAdmin } = useAdminAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          name: name.trim(),
          email: email.trim(),
          content: content.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit comment');
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
      
      // Reset form
      setName('');
      setEmail('');
      setContent('');
      setShowForm(false);
      
      alert('Comment submitted successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await fetch(`/api/comments?id=${commentId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error('Failed to delete comment');
      
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 bg-white/10 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">
          Comments ({comments.length})
        </h3>
        <p className="text-cyan-300 text-sm">
          Share your thoughts about this post
        </p>
      </div>

      {/* Comments List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center text-cyan-400 py-8">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-cyan-300 py-8">
            <p className="mb-4">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/40 rounded-lg p-4 border border-cyan-500/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-cyan-400 font-semibold">{comment.name}</h4>
                      <p className="text-cyan-300 text-xs">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-pink-400 hover:text-pink-300 text-sm px-2 py-1 hover:bg-pink-500/10 rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                <p className="text-cyan-100 leading-relaxed ml-13">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Comment Button/Form */}
        <div className="mt-8 pt-6 border-t border-cyan-500/20">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-cyan-400 rounded-lg hover:from-cyan-500/30 hover:to-pink-500/30 transition-all border border-cyan-500/30 hover:border-pink-500/30"
            >
              💬 Add a Comment
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Comment *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                  rows={4}
                  className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-vertical"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || !name || !email || !content}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:from-cyan-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Post Comment'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setName('');
                    setEmail('');
                    setContent('');
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <p className="text-cyan-300 text-xs">
                Your email will not be published. Required fields are marked *
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  );
} 