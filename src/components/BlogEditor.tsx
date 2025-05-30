import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BlogCategory, BlogDraft } from '@/types/blog'

interface BlogEditorProps {
  initialDraft?: BlogDraft;
  onSave: (draft: BlogDraft) => void;
}

export default function BlogEditor({ initialDraft, onSave }: BlogEditorProps) {
  const [draft, setDraft] = useState<BlogDraft>(() => ({
    id: initialDraft?.id || crypto.randomUUID(),
    title: initialDraft?.title || '',
    slug: initialDraft?.slug || '',
    content: initialDraft?.content || '',
    excerpt: initialDraft?.excerpt || '',
    category: initialDraft?.category || 'other',
    tags: initialDraft?.tags || [],
    images: initialDraft?.images || [],
    isDraft: true,
    author: initialDraft?.author || { name: 'Your Name' },
    lastEdited: new Date().toISOString(),
    autoSaved: false
  }));

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      onSave({ ...draft, lastEdited: new Date().toISOString(), autoSaved: true });
    }, 5000);

    return () => clearTimeout(autoSave);
  }, [draft, onSave]);

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title Input */}
          <div className="relative">
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Enter your title..."
              className="w-full bg-gray-800 border-2 border-cyan-500 rounded-lg p-4 text-2xl font-bold text-cyan-400 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <div className="absolute -bottom-2 left-4 bg-gray-900 px-2 text-sm text-cyan-300">
              Title
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex gap-4">
            {(Object.values(BlogCategory) as BlogCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setDraft({ ...draft, category })}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  draft.category === category
                    ? 'border-pink-500 bg-pink-500/20 text-pink-400'
                    : 'border-cyan-500 hover:bg-cyan-500/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Content Editor */}
          <div className="relative">
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Write your blog post..."
              className="w-full h-96 bg-gray-800 border-2 border-cyan-500 rounded-lg p-4 text-cyan-400 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <div className="absolute -bottom-2 left-4 bg-gray-900 px-2 text-sm text-cyan-300">
              Content
            </div>
          </div>

          {/* Image Upload */}
          <div className="relative border-2 border-dashed border-cyan-500 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                // Handle image upload logic here
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-cyan-400">
              <p className="text-xl">Drop images here or click to upload</p>
              <p className="text-sm text-cyan-300">Supports: JPG, PNG, GIF</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onSave({ ...draft, isDraft: true })}
              className="px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => onSave({ ...draft, isDraft: false })}
              className="px-6 py-3 bg-pink-500 text-gray-900 rounded-lg hover:bg-pink-400 transition-colors"
            >
              Publish
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 