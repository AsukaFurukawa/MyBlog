import { motion } from 'framer-motion'
import { BlogCategory } from '@/types/blog'
import GlitchEffect from '@/components/GlitchEffect'

const categories: BlogCategory[] = [
  'tech',
  'idea',
  'abstract',
  'art',
  'finance',
  'project',
  'other'
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400">
      {/* Cyberpunk Header */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative h-full flex items-center justify-center">
          <GlitchEffect>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400"
            >
              Blog
            </motion.h1>
          </GlitchEffect>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full border-2 border-cyan-500 hover:bg-cyan-500/20 transition-colors"
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <motion.article
              key={post}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-cyan-500/50 hover:border-pink-500/50 transition-colors"
            >
              <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-pink-500/20" />
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400">
                    tech
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-pink-500/20 text-pink-400">
                    project
                  </span>
                </div>
                <GlitchEffect>
                  <h2 className="text-2xl font-bold mb-2">Sample Blog Post {post}</h2>
                </GlitchEffect>
                <p className="text-gray-400 mb-4">
                  A brief description of the blog post content...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-300">2 days ago</span>
                  <button className="text-pink-400 hover:text-pink-300 transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
} 