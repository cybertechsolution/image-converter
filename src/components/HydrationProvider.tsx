'use client';

import { useEffect } from 'react';

/**
 * Component to handle hydration mismatches caused by browser extensions
 * that modify the DOM after React hydrates (like password managers, accessibility tools, etc.)
 */
export default function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress hydration warnings for known browser extension attributes
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('cz-shortcut-listen') ||
         message.includes('data-lastpass-') ||
         message.includes('data-1password-') ||
         message.includes('data-bitwarden-') ||
         message.includes('hydration failed') && message.includes('browser extension'))
      ) {
        // Suppress these specific hydration warnings from browser extensions
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}
