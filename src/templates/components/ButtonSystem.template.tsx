import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Button variant definitions
interface ButtonVariant {
  background: string;
  color: string;
  border?: string;
  hover: {
    background: string;
    color?: string;
    transform?: string;
  };
  focus: {
    outline: string;
    outlineOffset: string;
  };
  disabled: {
    opacity: number;
    cursor: string;
  };
}

interface ButtonSize {
  padding: string;
  fontSize: string;
  minHeight: string;
  borderRadius: string;
}

// Button system configuration
const buttonVariants: Record<string, ButtonVariant> = {
  primary: {
    background: '#0066cc',
    color: '#ffffff',
    hover: {
      background: '#0052a3',
    },
    focus: {
      outline: '2px solid #0066cc',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  secondary: {
    background: '#6b7280',
    color: '#ffffff',
    hover: {
      background: '#4b5563',
    },
    focus: {
      outline: '2px solid #6b7280',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  outline: {
    background: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db',
    hover: {
      background: '#f9fafb',
      color: '#111827',
    },
    focus: {
      outline: '2px solid #0066cc',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  ghost: {
    background: 'transparent',
    color: '#374151',
    hover: {
      background: '#f3f4f6',
      color: '#111827',
    },
    focus: {
      outline: '2px solid #0066cc',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  destructive: {
    background: '#dc2626',
    color: '#ffffff',
    hover: {
      background: '#b91c1c',
    },
    focus: {
      outline: '2px solid #dc2626',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  success: {
    background: '#059669',
    color: '#ffffff',
    hover: {
      background: '#047857',
    },
    focus: {
      outline: '2px solid #059669',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  warning: {
    background: '#d97706',
    color: '#ffffff',
    hover: {
      background: '#b45309',
    },
    focus: {
      outline: '2px solid #d97706',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
};

const buttonSizes: Record<string, ButtonSize> = {
  xs: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    minHeight: '28px',
    borderRadius: '0.25rem',
  },
  sm: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    minHeight: '36px',
    borderRadius: '0.375rem',
  },
  md: {
    padding: '0.625rem 1.25rem',
    fontSize: '1rem',
    minHeight: '44px',
    borderRadius: '0.5rem',
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    minHeight: '52px',
    borderRadius: '0.5rem',
  },
  xl: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    minHeight: '60px',
    borderRadius: '0.75rem',
  },
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Button variants and sizes
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;

  // Content
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;

  // Button behavior
  fullWidth?: boolean;
  href?: string;

  // Custom styling
  className?: string;

  // Accessibility
  ariaLabel?: string;
}

// Button component with forward ref for proper ref handling
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      fullWidth = false,
      href,
      className,
      disabled,
      ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const variantStyles = buttonVariants[variant];
    const sizeStyles = buttonSizes[size];

    const isDisabled = disabled || loading;

    // Handle click for both button and link behavior
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (href) {
        window.location.href = href;
      } else {
        onClick?.(e);
      }
    };

    // Base button styles
    const baseStyles: React.CSSProperties = {
      backgroundColor: variantStyles.background,
      color: variantStyles.color,
      border: variantStyles.border ? `1px solid ${variantStyles.border}` : 'none',
      padding: sizeStyles.padding,
      fontSize: sizeStyles.fontSize,
      minHeight: sizeStyles.minHeight,
      borderRadius: sizeStyles.borderRadius,
      cursor: isDisabled ? variantStyles.disabled.cursor : 'pointer',
      opacity: isDisabled ? variantStyles.disabled.opacity : 1,
      transition: 'all 150ms ease-out',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      textDecoration: 'none',
      width: fullWidth ? '100%' : 'auto',
      position: 'relative',
      overflow: 'hidden',
    };



    return (
      <button
        ref={ref}
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'hover:shadow-md active:scale-95 transition-all duration-150',
          className
        )}
        style={baseStyles}
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {leftIcon && !loading && <span>{leftIcon}</span>}

        {/* Button content */}
        <span>{loading && loadingText ? loadingText : children}</span>

        {/* Right icon */}
        {rightIcon && !loading && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Convenience components for common button variants
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="outline" />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="ghost" />
);

export const DestructiveButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="destructive" />
);

export const SuccessButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="success" />
);

export const WarningButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="warning" />
);

// Button group component for related buttons
interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonGroup({
  children,
  variant = 'horizontal',
  spacing = 'md',
  className,
}: ButtonGroupProps) {
  const spacingClasses = {
    none: '',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  return (
    <div
      className={cn(
        'inline-flex',
        variant === 'vertical' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
}

// Icon button component for icon-only buttons
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string; // Required for icon buttons
}

export function IconButton({ icon, ...props }: IconButtonProps) {
  return <Button {...props}>{icon}</Button>;
}

// Floating action button component
interface FABProps extends ButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({ position = 'bottom-right', className, ...props }: FABProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <Button
      {...props}
      className={cn(
        positionClasses[position],
        'rounded-full shadow-lg hover:shadow-xl z-50',
        className
      )}
      size="lg"
    />
  );
}

// Export the main Button component and utilities
export { Button, buttonVariants, buttonSizes };
export type { ButtonProps, ButtonVariant, ButtonSize };
