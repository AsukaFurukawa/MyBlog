"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogDraft } from '@/types/blog';
import CyberBackground from '@/components/CyberBackground';
import { useAdminAuth } from '@/components/AdminAuthContext';

export default function DraftsPage() {
  const { isAdmin, setShowLoginModal } = useAdminAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setShowLoginModal(true);
      router.push('/');
      return;
    }
    
    fetchDrafts();
  }, [isAdmin, setShowLoginModal, router]);

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/blog?isDraft=true');
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      setDrafts(drafts.filter(draft => draft.id !== id));
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">Access Denied</h1>
          <p className="text-cyan-300">You need admin access to view drafts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-cyan-400 text-xl">Loading drafts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a003f] via-[#1a1a6e] via-60% to-[#0a0026] pt-24 p-8">
      <CyberBackground />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-pink-400 font-orbitron drop-shadow-[0_0_24px_#8f5cff]">
              Draft Posts
            </h1>
            <Link
              href="/blog/new"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors font-bold"
            >
              New Draft
            </Link>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cyan-400 text-xl">No drafts yet</p>
              <p className="text-cyan-300 mt-2">Start writing your first blog post!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-cyan-500/20"
                >
                  <h2 className="text-xl font-bold text-cyan-400 mb-2">{draft.title}</h2>
                  <p className="text-cyan-300 text-sm mb-4">
                    Last edited: {new Date(draft.lastEdited).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {draft.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/blog/edit/${draft.id}`}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
} 