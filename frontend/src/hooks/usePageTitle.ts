import { useEffect } from 'react';
import { generateTitle } from '@/utils/title-utils';

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = generateTitle(pageTitle);
    
    return () => {
      document.title = generateTitle();
    };
  }, [pageTitle]);
}
