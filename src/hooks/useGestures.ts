import { useEffect, useRef, useState } from "react";

interface GestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  velocityThreshold?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useGestures = (options: GestureOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    threshold = 50,
    velocityThreshold = 0.3
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [lastTouches, setLastTouches] = useState<TouchList | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
      setLastTouches(e.touches);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouches?.length === 2 && onPinch) {
        // Handle pinch gesture
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const lastDistance = getDistance(lastTouches[0], lastTouches[1]);
        const scale = currentDistance / lastDistance;
        onPinch(scale);
      }
      setLastTouches(e.touches);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart || e.touches.length > 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.timestamp;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

      // Only trigger if gesture meets threshold and velocity requirements
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (velocity > velocityThreshold) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0 && onSwipeDown) {
              onSwipeDown();
            } else if (deltaY < 0 && onSwipeUp) {
              onSwipeUp();
            }
          }
        }
      }

      setTouchStart(null);
      setLastTouches(null);
    };

    // Add passive listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, lastTouches, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, threshold, velocityThreshold]);

  return ref;
};

// Helper function to calculate distance between two touch points
const getDistance = (touch1: Touch, touch2: Touch): number => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};