"use client";

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BlogCategory, BlogDraft } from '@/types/blog'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

interface BlogEditorProps {
  initialDraft?: BlogDraft;
  onSave: (draft: BlogDraft) => void;
}

const categories: BlogCategory[] = [
  'tech', 'idea', 'abstract', 'art', 'finance', 'project', 'other'
];

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function PendantAccent() {
  // const { scene } = useGLTF('/abstract_rainbow_translucent_pendant.glb');
  const ref = useRef<any>();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <mesh ref={ref} scale={[0.8, 0.8, 0.8]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <torusGeometry args={[1, 0.3, 16, 32]} />
      <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={0.4} transparent opacity={0.8} />
    </mesh>
  );
}

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  selectedText?: string;
}

function LinkModal({ isOpen, onClose, onInsert, selectedText }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState(selectedText || '');

  useEffect(() => {
    if (isOpen) {
      setText(selectedText || '');
      setUrl('');
    }
  }, [isOpen, selectedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && text) {
      onInsert(url, text);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-cyan-500/20 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Insert Link</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cyan-300 text-sm mb-2">Link Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter link text"
              className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-cyan-300 text-sm mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-gray-800/60 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
              disabled={!url || !text}
            >
              Insert Link
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function BlogEditor({ initialDraft, onSave }: BlogEditorProps) {
  const [draft, setDraft] = useState<BlogDraft>(() => ({
    ...initialDraft,
    id: initialDraft?.id || '', // leave blank for now
    title: initialDraft?.title || '',
    slug: initialDraft?.slug || '',
    content: initialDraft?.content || '',
    excerpt: initialDraft?.excerpt || '',
    category: initialDraft?.category || 'other',
    tags: initialDraft?.tags || [],
    images: initialDraft?.images || [],
    isDraft: true,
    author: initialDraft?.author || { name: 'Prachi Sinha' },
    lastEdited: new Date().toISOString(),
    autoSaved: false
  }));
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Set the id on the client after mount if not present
  useEffect(() => {
    if (!draft.id) {
      setDraft(d => ({ ...d, id: uuidv4() }));
    }
  }, [draft.id]);

  // Auto-save functionality - disabled for now
  // useEffect(() => {
  //   const autoSave = setTimeout(() => {
  //     onSave({ ...draft, lastEdited: new Date().toISOString(), autoSaved: true });
  //   }, 5000);
  //   return () => clearTimeout(autoSave);
  // }, [draft, onSave]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      try {
        console.log('Uploading file:', file.name, file.type, file.size);
        
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/uploads', {
          method: 'POST',
          body: formData
        });
        
        console.log('Upload response status:', res.status);
        const data = await res.json();
        console.log('Upload response data:', data);
        
        if (data.url) {
          setDraft(d => ({ ...d, images: [...d.images, data.url] }));
          console.log('Image added to draft:', data.url);
        } else if (data.error) {
          console.error('Upload error:', data.error);
          alert(`Error uploading ${file.name}: ${data.error}`);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !draft.tags.includes(tagInput.trim())) {
      setDraft({ ...draft, tags: [...draft.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDraft({ ...draft, tags: draft.tags.filter(t => t !== tag) });
  };

  const insertLink = (url: string, text: string) => {
    const linkMarkdown = `[${text}](${url})`;
    const textarea = contentRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = draft.content.substring(0, start) + linkMarkdown + draft.content.substring(end);
      setDraft({ ...draft, content: newContent });
      
      // Set cursor position after the inserted link
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
      }, 0);
    }
  };

  const handleLinkButtonClick = () => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = draft.content.substring(start, end);
      setSelectedText(selected);
    }
    setShowLinkModal(true);
  };

  // Function to render content with clickable links (for preview)
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
          className="text-cyan-400 hover:text-pink-400 underline transition-colors"
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
    
    return parts;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#2a003f] via-[#1a1a6e] via-60% to-[#0a0026] p-8 font-orbitron">
      {/* 3D accent */}
      <div className="fixed top-0 right-0 w-80 h-80 z-0 pointer-events-none opacity-40 blur-xl">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <Suspense fallback={null}>
            <PendantAccent />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl p-10 shadow-2xl border-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-pink-400 mb-4 text-center font-orbitron drop-shadow-[0_0_24px_#8f5cff]">Write a New Blog Post</h1>
          {/* Title Input */}
          <input
            type="text"
            value={draft.title}
            onChange={e => setDraft({ ...draft, title: e.target.value })}
            placeholder="Enter your title..."
            className="w-full bg-gray-800/60 border-none rounded-lg p-4 text-2xl font-bold text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors font-orbitron drop-shadow-[0_0_16px_#0fffc3]"
          />
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setDraft({ ...draft, category })}
                className={`px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg text-cyan-300 font-semibold shadow-md border-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${draft.category === category ? 'bg-pink-500/30 text-pink-200' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Tag Input */}
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="bg-gray-800/60 border-none rounded-lg p-2 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
              onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition-colors font-bold"
            >
              Add Tag
            </button>
            <div className="flex gap-2 flex-wrap">
              {draft.tags.map(tag => (
                <span key={tag} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-semibold">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-pink-400 hover:text-pink-300">×</button>
                </span>
              ))}
            </div>
          </div>
          {/* Content Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-cyan-300 text-sm font-medium">Content</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLinkButtonClick}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                  title="Insert Link"
                >
                  🔗 Link
                </button>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={draft.content}
              onChange={e => setDraft({ ...draft, content: e.target.value })}
              placeholder="Write your blog post..."
              className="w-full h-64 bg-gray-800/60 border-none rounded-lg p-4 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
            />
            
            {/* Content Preview */}
            {draft.content && (
              <div className="mt-4">
                <h4 className="text-cyan-300 text-sm font-medium mb-2">Preview:</h4>
                <div className="bg-gray-800/40 border border-cyan-500/20 rounded-lg p-4 text-cyan-300 text-sm max-h-32 overflow-y-auto">
                  {renderContentWithLinks(draft.content)}
                </div>
              </div>
            )}
          </div>
          {/* Image Upload */}
          <div className="relative border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center bg-white/5 backdrop-blur-lg">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-cyan-400">
              <p className="text-xl">Drop images here or click to upload</p>
              <p className="text-sm text-cyan-300">Supports: JPG, PNG, GIF</p>
            </div>
            {/* Preview uploaded images */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {draft.images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 border-2 border-cyan-500/30 rounded-lg overflow-hidden">
                  <img src={img} alt={`uploaded-${idx}`} className="object-cover w-full h-full" />
                  <button
                    onClick={() => setDraft({ ...draft, images: draft.images.filter((_, i) => i !== idx) })}
                    className="absolute top-1 right-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-pink-400"
                  >×</button>
                </div>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onSave({ ...draft, isDraft: true })}
              className="px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg hover:bg-cyan-400 transition-colors font-bold"
            >
              Save Draft
            </button>
            <button
              onClick={() => onSave({ ...draft, isDraft: false })}
              className="px-6 py-3 bg-pink-500 text-gray-900 rounded-lg hover:bg-pink-400 transition-colors font-bold"
            >
              Publish
            </button>
          </div>
        </motion.div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={insertLink}
        selectedText={selectedText}
      />
    </div>
  );
}
// @ts-ignore
useGLTF.preload('/abstract_rainbow_translucent_pendant.glb'); 