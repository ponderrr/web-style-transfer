import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  // Content
  children: React.ReactNode;

  // Transition configuration
  type?: 'fade' | 'slide' | 'scale' | 'wipe';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  easing?: string;
  delay?: number;

  // Stagger animation
  stagger?: {
    elements: string;
    delay: number;
  };

  // Accessibility
  respectReducedMotion?: boolean;
  allowSkip?: boolean;

  // Callbacks
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;

  // Styling
  className?: string;
}

// Skip animation button
function SkipAnimationButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        'fixed top-4 right-4 z-50 px-4 py-2 bg-black/80 text-white rounded-md text-sm font-medium transition-opacity hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black',
        className
      )}
      onClick={onClick}
      aria-label="Skip animation"
    >
      Skip Animation
    </button>
  );
}

export function PageTransition({
  children,
  type = 'fade',
  direction = 'left',
  duration = 300,
  easing = 'ease-out',
  delay = 0,
  stagger,
  respectReducedMotion = true,
  allowSkip = true,
  onEnter,
  onEntered,
  className,
}: PageTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const shouldAnimate = respectReducedMotion ? !prefersReducedMotion : true;
  const effectiveDuration = shouldAnimate ? duration : 0;

  // Handle animation lifecycle
  useEffect(() => {
    if (skipAnimation || !shouldAnimate) {
      setHasCompleted(true);
      onEntered?.();
      return;
    }

    setIsAnimating(true);
    onEnter?.();

    const timer = setTimeout(() => {
      setIsAnimating(false);
      setHasCompleted(true);
      onEntered?.();
    }, effectiveDuration + delay);

    return () => clearTimeout(timer);
  }, [skipAnimation, shouldAnimate, effectiveDuration, delay, onEnter, onEntered]);

  // Handle stagger animations
  useEffect(() => {
    if (!stagger || !shouldAnimate || skipAnimation) return;

    const elements = document.querySelectorAll(stagger.elements);
    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.animationDelay = `${index * stagger.delay}ms`;
      htmlElement.style.animationDuration = `${duration}ms`;
      htmlElement.style.animationTimingFunction = easing;
    });
  }, [stagger, shouldAnimate, skipAnimation, duration, easing]);

  const handleSkip = () => {
    setSkipAnimation(true);
  };

  // Animation styles based on type and direction
  const getAnimationStyles = () => {
    if (skipAnimation || !shouldAnimate) {
      return {
        opacity: 1,
        transform: 'none',
        transition: 'none',
      };
    }

    const baseStyles = {
      transition: `all ${effectiveDuration}ms ${easing} ${delay}ms`,
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyles,
          opacity: isAnimating ? 0 : 1,
        };

      case 'slide': {
        const slideTransform = {
          left: isAnimating ? 'translateX(-100%)' : 'translateX(0)',
          right: isAnimating ? 'translateX(100%)' : 'translateX(0)',
          up: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
          down: isAnimating ? 'translateY(100%)' : 'translateY(0)',
        }[direction];

        return {
          ...baseStyles,
          transform: slideTransform,
          opacity: isAnimating ? 0 : 1,
        };
      }

      case 'scale':
        return {
          ...baseStyles,
          transform: isAnimating ? 'scale(0.8)' : 'scale(1)',
          opacity: isAnimating ? 0 : 1,
        };

      case 'wipe': {
        const wipeTransform = {
          left: isAnimating ? 'translateX(-100%)' : 'translateX(0)',
          right: isAnimating ? 'translateX(100%)' : 'translateX(0)',
          up: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
          down: isAnimating ? 'translateY(100%)' : 'translateY(0)',
        }[direction];

        return {
          ...baseStyles,
          transform: wipeTransform,
          transformOrigin: {
            left: 'left center',
            right: 'right center',
            up: 'center top',
            down: 'center bottom',
          }[direction],
        };
      }

      default:
        return {
          ...baseStyles,
          opacity: 1,
        };
    }
  };

  return (
    <div
      className={cn('relative', className)}
      style={getAnimationStyles()}
      role="main"
      aria-live="polite"
    >
      {/* Skip animation button */}
      {allowSkip && shouldAnimate && isAnimating && <SkipAnimationButton onClick={handleSkip} />}

      {/* Content */}
      <div
        className={cn(
          'transition-opacity duration-200',
          hasCompleted ? 'opacity-100' : 'opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Convenience components for common transitions
export function FadeTransition(props: Omit<PageTransitionProps, 'type'>) {
  return <PageTransition {...props} type="fade" />;
}

export function SlideTransition({
  direction = 'left',
  ...props
}: Omit<PageTransitionProps, 'type'>) {
  return <PageTransition {...props} type="slide" direction={direction} />;
}

export function ScaleTransition(props: Omit<PageTransitionProps, 'type'>) {
  return <PageTransition {...props} type="scale" />;
}

export function WipeTransition({
  direction = 'left',
  ...props
}: Omit<PageTransitionProps, 'type'>) {
  return <PageTransition {...props} type="wipe" direction={direction} />;
}

// Page transition wrapper for route changes
interface RouteTransitionProps extends PageTransitionProps {
  routeKey?: string;
}

export function RouteTransition({ routeKey, ...props }: RouteTransitionProps) {
  return <PageTransition {...props} key={routeKey} />;
}
