import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  current?: boolean;
}

interface LogoProps {
  src?: string;
  alt: string;
  href?: string;
}

interface NavigationProps {
  items: NavigationItem[];
  variant: 'sidebar' | 'topbar' | 'mobile';
  logo?: LogoProps;
  className?: string;
}

// Skip link for accessibility
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-3 rounded-md z-50"
    >
      Skip to main content
    </a>
  );
}

// Mobile menu button
function MobileMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      onClick={onClick}
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <svg
        className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

// Logo component
function Logo({ logo }: { logo?: LogoProps }) {
  if (!logo) return null;

  const logoContent = logo.src ? (
    <img src={logo.src} alt={logo.alt} className="h-8 w-auto sm:h-10" />
  ) : (
    <span className="text-xl font-bold text-gray-900">{logo.alt}</span>
  );

  return logo.href ? (
    <a href={logo.href} className="flex items-center">
      {logoContent}
    </a>
  ) : (
    <div className="flex items-center">{logoContent}</div>
  );
}

// Desktop navigation


// Mobile navigation
function MobileNavigation({ items, isOpen }: { items: NavigationItem[]; isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// Main Navigation Component
export function Navigation({ items, variant = 'topbar', logo, className }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close mobile menu when clicking outside or on a link
  React.useEffect(() => {
    const handleClickOutside = () => setMobileMenuOpen(false);
    const handleLinkClick = () => setMobileMenuOpen(false);

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      const links = document.querySelectorAll('#mobile-menu a');
      links.forEach(link => link.addEventListener('click', handleLinkClick));

      return () => {
        document.removeEventListener('click', handleClickOutside);
        links.forEach(link => link.removeEventListener('click', handleLinkClick));
      };
    }
  }, [mobileMenuOpen]);

  if (variant === 'sidebar') {
    return (
      <div className={cn('fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white', className)}>
        <SkipLink />
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <Logo logo={logo} />
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2" role="navigation">
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Topbar variant (default)
  return (
    <header className={cn('bg-gray-900 text-white shadow-sm', className)} role="banner">
      <SkipLink />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo logo={logo} />
            </div>
          </div>

          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4" role="navigation">
              {items.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                    item.current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:hidden">
            <MobileMenuButton isOpen={mobileMenuOpen} onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>

      <MobileNavigation items={items} isOpen={mobileMenuOpen} />
    </header>
  );
}

// Export additional navigation variants
export function StickyNavigation(props: NavigationProps) {
  return (
    <div className="sticky top-0 z-40">
      <Navigation {...props} />
    </div>
  );
}

export function TransparentNavigation(props: NavigationProps) {
  return <Navigation {...props} className="bg-transparent text-white backdrop-blur-sm" />;
}
