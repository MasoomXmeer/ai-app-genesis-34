import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function Analytics() {
  useEffect(() => {
    // Initialize dataLayer first
    (window as any).dataLayer = (window as any).dataLayer || [];
    
    window.gtag = function() {
      // eslint-disable-next-line prefer-rest-params
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push(arguments);
      }
    };
    
    // Basic analytics setup (Google Analytics example)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);
    
    window.gtag('js', new Date());
    window.gtag('config', 'GA_MEASUREMENT_ID');

    // Custom event tracking
    const trackEvent = (eventName: string, parameters?: any) => {
      if (window.gtag) {
        window.gtag('event', eventName, parameters);
      }
    };

    // Track page views
    const trackPageView = (path: string) => {
      if (window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: path,
        });
      }
    };

    // Expose tracking functions globally
    (window as any).trackEvent = trackEvent;
    (window as any).trackPageView = trackPageView;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}

// Utility functions for tracking
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && (window as any).trackEvent) {
    (window as any).trackEvent(eventName, parameters);
  }
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).trackPageView) {
    (window as any).trackPageView(path);
  }
};