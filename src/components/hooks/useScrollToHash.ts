// src/hooks/useScrollToHash.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Add a small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(-2, 0);
    }
  }, [location]);
};