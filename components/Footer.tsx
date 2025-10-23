/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryIcon } from './icons';

const REMIX_SUGGESTIONS = [
  "Gợi ý remix: Tạo một lookbook có thể chia sẻ.",
  "Gợi ý remix: Tích hợp API e-commerce để tìm các sản phẩm tương tự.",
  "Gợi ý remix: Thêm phụ kiện như mũ, kính râm, hoặc túi xách.",
  "Gợi ý remix: Tạo 'điểm phong cách' cho trang phục.",
  "Gợi ý remix: Cho phép người dùng lưu các bộ trang phục yêu thích.",
  "Gợi ý remix: Tạo các phiên bản màu sắc khác nhau cho trang phục.",
];

interface FooterProps {
  isOnDressingScreen?: boolean;
  onOpenLibrary: () => void;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false, onOpenLibrary }) => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200/60 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:flex' : 'flex'} items-center justify-center`}>
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 max-w-7xl px-4">
        <div className="flex items-center gap-4">
          <p>
            Tạo bởi{' '}
            <a 
              href="https://x.com/vuvananh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 hover:underline"
            >
              @vuvananh
            </a>
          </p>
          {isOnDressingScreen && (
              <button onClick={onOpenLibrary} className="flex items-center gap-1.5 font-semibold text-gray-800 hover:underline">
                  <LibraryIcon className="w-4 h-4" />
                  Thư viện
              </button>
          )}
        </div>
        <div className="h-4 mt-1 sm:mt-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={suggestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-center sm:text-right"
              >
                {REMIX_SUGGESTIONS[suggestionIndex]}
              </motion.p>
            </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;