'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTagsProps {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  }
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.5
    }
  }
};

const loadingVariants = {
  animate: {
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function AnimatedTags({
  tags,
  selectedTag,
  onTagChange,
  loading = false
}: AnimatedTagsProps) {
  
  if (loading) {
    return (
      <motion.div
        className="text-center mt-6"
        variants={loadingVariants}
        animate="animate"
      >
        <p className="mb-3 text-gray-500 font-medium">Popular Tags:</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-6 bg-gray-200 rounded-full animate-pulse"
              style={{ width: `${60 + Math.random() * 40}px` }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (tags.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="tags-section"
        className="text-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="mb-3 text-gray-500 font-medium">Popular Tags:</p>
        <motion.div
          className="flex justify-center gap-2 flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tags.map(tag => (
            <motion.button
              key={tag}
              variants={tagVariants}
              onClick={() => onTagChange(selectedTag === tag ? '' : tag)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-[#9B8B7E] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              #{tag}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}