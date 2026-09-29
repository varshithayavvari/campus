import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-36 md:bottom-24 right-5 z-30 p-2.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-xs border border-white/20 dark:border-slate-800"
      title="Back to top"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
};
