import Hero3D from '@/components/Hero3D'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero3D />
      
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Sample blog post cards - we'll make these dynamic later */}
          {[1, 2, 3].map((post) => (
            <motion.article
              key={post}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Sample Blog Post {post}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  A brief description of the blog post content...
                </p>
                <div className="mt-4">
                  <span className="text-sm text-blue-500">Read More →</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  )
} 