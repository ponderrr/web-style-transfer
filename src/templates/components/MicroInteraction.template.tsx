import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MicroInteractionProps {
  // Content
  children: React.ReactNode;

  // Trigger configuration
  trigger?: 'hover' | 'focus' | 'click' | 'scroll';
  disabled?: boolean;

  // Animation properties
  scale?: number;
  rotate?: number;
  translate?: [number, number];
  opacity?: number;

  // Animation settings
  duration?: number;
  easing?: string;
  delay?: number;

  // Interaction feedback
  hapticFeedback?: boolean;

  // Accessibility
  respectReducedMotion?: boolean;
  semanticFeedback?: boolean;

  // Callbacks
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;

  // Styling
  className?: string;
}

// Haptic feedback utility (for supported devices)
function triggerHapticFeedback() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function MicroInteraction({
  children,
  trigger = 'hover',
  disabled = false,
  scale,
  rotate,
  translate,
  opacity,
  duration = 200,
  easing = 'ease-out',
  delay = 0,
  hapticFeedback = false,
  respectReducedMotion = true,
  semanticFeedback = false,
  onInteractionStart,
  onInteractionEnd,
  className,
}: MicroInteractionProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const shouldAnimate = respectReducedMotion ? !prefersReducedMotion : true;
  const effectiveDuration = shouldAnimate ? duration : 0;

  // Handle interaction start
  const handleInteractionStart = () => {
    if (disabled) return;

    setIsInteracting(true);
    onInteractionStart?.();

    if (hapticFeedback && shouldAnimate) {
      triggerHapticFeedback();
    }
  };

  // Handle interaction end
  const handleInteractionEnd = () => {
    if (disabled) return;

    setIsInteracting(false);
    onInteractionEnd?.();
  };

  // Handle click interactions
  const handleClick = () => {
    if (trigger === 'click') {
      handleInteractionStart();
      setTimeout(handleInteractionEnd, effectiveDuration);
    }
  };

  // Handle scroll-based interactions
  useEffect(() => {
    if (trigger !== 'scroll' || !elementRef.current) return;

    const element = elementRef.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handleInteractionStart();
          } else {
            handleInteractionEnd();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [trigger]);

  // Generate transform styles
  const getTransformStyles = () => {
    if (!isInteracting || !shouldAnimate) {
      return {
        transform: 'none',
        opacity: 1,
        transition: `all ${effectiveDuration}ms ${easing} ${delay}ms`,
      };
    }

    const transforms: string[] = [];
    const styles: React.CSSProperties = {
      transition: `all ${effectiveDuration}ms ${easing} ${delay}ms`,
    };

    if (scale && scale !== 1) {
      transforms.push(`scale(${scale})`);
    }

    if (rotate) {
      transforms.push(`rotate(${rotate}deg)`);
    }

    if (translate) {
      transforms.push(`translate(${translate[0]}px, ${translate[1]}px)`);
    }

    if (transforms.length > 0) {
      styles.transform = transforms.join(' ');
    }

    if (opacity !== undefined && opacity !== 1) {
      styles.opacity = opacity;
    }

    return styles;
  };

  // Generate event handlers based on trigger type
  const getEventHandlers = () => {
    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: handleInteractionStart,
          onMouseLeave: handleInteractionEnd,
        };
      case 'focus':
        return {
          onFocus: handleInteractionStart,
          onBlur: handleInteractionEnd,
        };
      case 'click':
        return {
          onClick: handleClick,
        };
      case 'scroll':
        return {};
      default:
        return {};
    }
  };

  // Semantic feedback attributes
  const getAriaAttributes = () => {
    if (!semanticFeedback) return {};

    return {
      'aria-pressed': isInteracting,
      'aria-expanded': isInteracting,
    };
  };

  return (
    <div
      ref={elementRef}
      className={cn('inline-block', disabled && 'pointer-events-none opacity-50', className)}
      style={getTransformStyles()}
      {...getEventHandlers()}
      {...getAriaAttributes()}
    >
      {children}
    </div>
  );
}

// Convenience components for common micro-interactions
export function HoverLift({
  children,
  scale = 1.05,
  ...props
}: Omit<MicroInteractionProps, 'trigger' | 'scale'>) {
  return (
    <MicroInteraction {...props} trigger="hover" scale={scale}>
      {children}
    </MicroInteraction>
  );
}

export function ClickFeedback({
  children,
  scale = 0.95,
  ...props
}: Omit<MicroInteractionProps, 'trigger' | 'scale'>) {
  return (
    <MicroInteraction {...props} trigger="click" scale={scale}>
      {children}
    </MicroInteraction>
  );
}

export function FocusGlow({ children, ...props }: Omit<MicroInteractionProps, 'trigger'>) {
  return (
    <MicroInteraction {...props} trigger="focus">
      {children}
    </MicroInteraction>
  );
}

export function LoadingPulse({
  children,
  ...props
}: Omit<MicroInteractionProps, 'scale' | 'opacity'>) {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MicroInteraction {...props} scale={isPulsing ? 1.02 : 1} opacity={isPulsing ? 0.8 : 1}>
      {children}
    </MicroInteraction>
  );
}

export function ScrollReveal({
  children,
  translate = [0, 20],
  opacity = 0,
  ...props
}: Omit<MicroInteractionProps, 'trigger' | 'translate' | 'opacity'>) {
  return (
    <MicroInteraction {...props} trigger="scroll" translate={translate} opacity={opacity}>
      {children}
    </MicroInteraction>
  );
}

// Button with micro-interactions
export function InteractiveButton({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
} & Omit<MicroInteractionProps, 'children'>) {
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px]';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };

  return (
    <MicroInteraction
      {...props}
      trigger="click"
      scale={0.98}
      className={cn(baseClasses, variantClasses[variant])}
    >
      {children}
    </MicroInteraction>
  );
}

// Card with hover lift effect
export function InteractiveCard({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Omit<MicroInteractionProps, 'children'>) {
  return (
    <MicroInteraction
      {...props}
      trigger="hover"
      scale={1.02}
      translate={[0, -4]}
      className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      {children}
    </MicroInteraction>
  );
}
