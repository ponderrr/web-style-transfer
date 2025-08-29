import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  // Content
  children: React.ReactNode;

  // Configuration
  isOpen?: boolean;
  position?: 'left' | 'right';
  width?: string;
  collapsible?: boolean;
  overlay?: boolean;

  // Responsive behavior
  breakpoint?: {
    mobile: 'overlay' | 'hidden';
    tablet: 'collapsed' | 'expanded';
    desktop: 'expanded';
  };

  // Styling
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;

  // Callbacks
  onToggle?: (isOpen: boolean) => void;
  onClose?: () => void;
}

// Skip link for accessibility
function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-3 rounded-md z-50"
    >
      {children}
    </a>
  );
}

// Overlay component
function Overlay({
  isVisible,
  onClick,
  className,
}: {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity',
        className
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

export function Sidebar({
  children,
  isOpen = true,
  position = 'left',
  width = '280px',
  collapsible = true,
  overlay = false,
  breakpoint = {
    mobile: 'overlay',
    tablet: 'expanded',
    desktop: 'expanded',
  },
  className,
  overlayClassName,
  contentClassName,
  onToggle,
  onClose,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (isMobile && breakpoint.mobile === 'hidden' && isOpen) {
        onClose?.();
      } else if (isTablet && breakpoint.tablet === 'collapsed' && isOpen && collapsible) {
        onToggle?.(false);
      } else if (!isMobile && !isTablet && breakpoint.desktop === 'expanded' && !isOpen) {
        onToggle?.(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, isOpen, collapsible, onToggle, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle body scroll prevention on mobile overlay
  useEffect(() => {
    const isMobileOverlay = window.innerWidth < 768 && overlay;

    if (isMobileOverlay && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, overlay]);

  // Focus management
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;

      // Focus first element when sidebar opens
      setTimeout(() => {
        if (firstElement) firstElement.focus();
      }, 100);
    }
  }, [isOpen]);

  const positionClasses = {
    left: {
      base: 'left-0',
      open: 'translate-x-0',
      closed: '-translate-x-full',
    },
    right: {
      base: 'right-0',
      open: 'translate-x-0',
      closed: 'translate-x-full',
    },
  };

  const currentPosition = positionClasses[position];

  return (
    <>
      {/* Skip link for main content */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      {/* Overlay for mobile */}
      <Overlay
        isVisible={overlay && isOpen && window.innerWidth < 768}
        onClick={onClose}
        className={overlayClassName}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed top-0 z-50 h-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out',
          'focus:outline-none',
          currentPosition.base,
          isOpen ? currentPosition.open : currentPosition.closed,
          className
        )}
        style={{ width }}
        aria-hidden={!isOpen}
        aria-label="Sidebar navigation"
      >
        {/* Close button for mobile */}
        {overlay && (
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
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
        )}

        {/* Sidebar content */}
        <div className={cn('h-full overflow-y-auto p-6', contentClassName)}>{children}</div>
      </aside>
    </>
  );
}

// Layout component that includes sidebar and main content
interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarProps?: Omit<SidebarProps, 'children'>;
}

export function SidebarLayout({ sidebar, children, sidebarProps }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
        {...sidebarProps}
      >
        {sidebar}
      </Sidebar>

      {/* Main content */}
      <main
        id="main-content"
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'ml-0 md:ml-72' : 'ml-0'
        )}
      >
        <div className="p-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {children}
        </div>
      </main>
    </div>
  );
}

// Convenience components for common sidebar configurations
export function LeftSidebar(props: Omit<SidebarProps, 'position'>) {
  return <Sidebar {...props} position="left" />;
}

export function RightSidebar(props: Omit<SidebarProps, 'position'>) {
  return <Sidebar {...props} position="right" />;
}

export function CollapsibleSidebar(props: Omit<SidebarProps, 'collapsible'>) {
  return <Sidebar {...props} collapsible={true} />;
}

export function OverlaySidebar(props: Omit<SidebarProps, 'overlay'>) {
  return <Sidebar {...props} overlay={true} />;
}
