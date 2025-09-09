'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error';
  onRemove: (id: string) => void;
}

export function ToastItem({ id, message, type = 'success', onRemove }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300); // Match animation duration
    }, 4000); // Show for 4 seconds

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.3 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-xs`}
        >
          <span>{message}</span>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => onRemove(id), 300);
            }}
            className="hover:bg-black/20 p-1 rounded"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
