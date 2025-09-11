'use client';
import React from 'react';
// Removed motion import for React 19 compatibility

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  color?: string;
  postCount?: number;
}

interface AnimatedFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  postsCount: number;
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.6
    }
  }
};

const loadingVariants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function AnimatedFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  postsCount,
  loading = false
}: AnimatedFiltersProps) {
  
  const cleanSlug = (slug: string) => {
    return slug.split(/[A-Z]/)[0] || slug;
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center gap-2 flex-wrap"
        variants={loadingVariants}
        animate="animate"
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-9 bg-gray-200 rounded-lg animate-pulse"
            style={{ width: `${80 + Math.random() * 40}px` }}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="filters"
        className="flex justify-center gap-3 flex-wrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.button
          variants={itemVariants}
          onClick={() => onCategoryChange('all')}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-[#9B8B7E] text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Posts ({postsCount})
        </motion.button>
        
        {categories.map(category => {
          const slug = cleanSlug(category.slug.current);
          const isSelected = selectedCategory === slug;
          
          return (
            <motion.button
              key={category._id}
              variants={itemVariants}
              onClick={() => onCategoryChange(slug)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSelected
                  ? `text-white shadow-lg`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
              style={{
                backgroundColor: isSelected ? (category.color || '#9B8B7E') : undefined
              }}
            >
              {category.title} ({category.postCount || 0})
            </motion.button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}