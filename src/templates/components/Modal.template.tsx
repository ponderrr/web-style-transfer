import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ModalAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  action?: 'confirm' | 'cancel' | 'close';
  onClick?: () => void;
}

interface ModalProps {
  // Content
  title: string;
  body: string | React.ReactNode;
  footer?: {
    actions?: ModalAction[];
  };

  // Behavior
  isOpen: boolean;
  onClose: () => void;
  backdrop?: 'blur' | 'darken' | 'none';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;

  // Animation
  enterAnimation?: 'fade-in' | 'slide-in';
  exitAnimation?: 'fade-out' | 'slide-out';
  animationDuration?: number;

  // Styling
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Size configurations
const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

// Animation configurations
const animationClasses = {
  'fade-in': 'animate-in fade-in duration-200',
  'fade-out': 'animate-out fade-out duration-200',
  'slide-in': 'animate-in slide-in-from-bottom-4 duration-200',
  'slide-out': 'animate-out slide-out-to-bottom-4 duration-200',
};

// Focus trap utility
function useFocusTrap(isActive: boolean) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener('keydown', handleTabKey);

    // Focus first element when modal opens
    setTimeout(() => {
      if (firstElement) firstElement.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return modalRef;
}

export function Modal({
  title,
  body,
  footer,
  isOpen,
  onClose,
  backdrop = 'darken',
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventScroll = true,
  enterAnimation = 'fade-in',
  animationDuration = 200,
  size = 'md',
  className,
}: ModalProps) {
  const modalRef = useFocusTrap(isOpen);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Handle body scroll prevention
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [preventScroll, isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);

      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      return () => {
        document.removeEventListener('keydown', handleEscape);

        // Restore previous focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, handleEscape]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  // Handle action clicks
  const handleActionClick = (action: ModalAction) => {
    if (action.onClick) {
      action.onClick();
    }

    // Auto-close based on action type
    if (action.action === 'close' || action.action === 'cancel' || action.action === 'confirm') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const backdropClasses = {
    blur: 'backdrop-blur-sm bg-black/20',
    darken: 'bg-black/50',
    none: '',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        animationClasses[enterAnimation],
        backdropClasses[backdrop],
        className
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-body"
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          sizeClasses[size]
        )}
        style={{ animationDuration: `${animationDuration}ms` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div id="modal-body" className="p-6 overflow-y-auto max-h-96">
          {typeof body === 'string' ? <p className="text-gray-700">{body}</p> : body}
        </div>

        {/* Footer */}
        {footer?.actions && footer.actions.length > 0 && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            {footer.actions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px]',
                  {
                    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500':
                      action.variant === 'primary',
                    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
                      action.variant === 'secondary',
                    'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500':
                      action.variant === 'ghost',
                  }
                )}
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience component for confirm dialogs
export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  ...props
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
} & Omit<ModalProps, 'body' | 'footer' | 'isOpen' | 'onClose'>) {
  return (
    <Modal
      title={title}
      body={message}
      isOpen={isOpen}
      onClose={onCancel}
      footer={{
        actions: [
          {
            label: 'Cancel',
            variant: 'ghost',
            action: 'cancel',
            onClick: onCancel,
          },
          {
            label: 'Confirm',
            variant: 'primary',
            action: 'confirm',
            onClick: onConfirm,
          },
        ],
      }}
      {...props}
    />
  );
}

// Convenience component for alert dialogs
export function AlertModal({
  title,
  message,
  onClose,
  isOpen,
  ...props
}: {
  title: string;
  message: string;
  onClose: () => void;
  isOpen: boolean;
} & Omit<ModalProps, 'body' | 'footer' | 'isOpen' | 'onClose'>) {
  return (
    <Modal
      title={title}
      body={message}
      isOpen={isOpen}
      onClose={onClose}
      footer={{
        actions: [
          {
            label: 'OK',
            variant: 'primary',
            action: 'close',
            onClick: onClose,
          },
        ],
      }}
      {...props}
    />
  );
}
