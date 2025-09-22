
import { useState, useEffect, RefObject } from 'react';

interface InViewOptions {
  /**
   * The threshold value between 0 and 1 that indicates what percentage
   * of the element should be visible before triggering
   */
  threshold?: number;
  
  /**
   * Whether the callback should only be triggered once
   */
  triggerOnce?: boolean;
  
  /**
   * Root margin value, similar to CSS margin
   */
  rootMargin?: string;
}

/**
 * Hook that tracks whether an element is in the viewport
 */
export function useInView(
  ref: RefObject<Element>,
  options: InViewOptions = {}
): boolean {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        const isVisible = entry.isIntersecting;
        setIsInView(isVisible);

        // Unobserve if it should trigger only once and is currently visible
        if (isVisible && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, threshold, rootMargin, triggerOnce]);

  return isInView;
}
