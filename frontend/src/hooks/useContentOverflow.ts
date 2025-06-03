import { useEffect, useState, RefObject } from 'react';

export function useContentOverflow(ref: RefObject<HTMLElement | null>): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!ref.current) return;
      
      const contentHeight = ref.current.scrollHeight + 100;
      const availableHeight = window.innerHeight - 200;
      
      setIsOverflowing(contentHeight > availableHeight);
    };

    checkOverflow();
    
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [ref]);

  return isOverflowing;
}
