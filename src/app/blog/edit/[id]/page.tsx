'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import { BlogPost, BlogDraft } from '@/types/blog';
import { useAdminAuth } from '@/components/AdminAuthContext';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const { isAdmin, setShowLoginModal } = useAdminAuth();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setShowLoginModal(true);
      router.push('/');
      return;
    }
    
    if (params.id) {
      fetchPost();
    }
  }, [params.id, isAdmin, setShowLoginModal, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Access Denied</h1>
          <p className="text-cyan-300">You need admin access to edit blog posts.</p>
        </div>
      </div>
    );
  }

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog?id=${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post. Please try again.');
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedPost: BlogPost) => {
    try {
      const response = await fetch(`/api/blog?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      router.push(updatedPost.isDraft ? '/drafts' : '/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-cyan-400 text-xl">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-cyan-400 text-xl">Post not found</div>
      </div>
    );
  }

  return <BlogEditor initialDraft={post} onSave={handleSave} />;
} 