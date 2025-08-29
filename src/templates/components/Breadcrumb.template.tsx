import React from 'react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  // Content
  items: BreadcrumbItem[];

  // Configuration
  separator?: string | React.ReactNode;
  maxItems?: number;
  collapsedText?: string;

  // Styling
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  currentClassName?: string;

  // Callbacks
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({
  items,
  separator = '/',
  maxItems,
  collapsedText = '...',
  className,
  itemClassName,
  separatorClassName,
  currentClassName,
  onItemClick,
}: BreadcrumbProps) {
  // Handle item limiting with ellipsis
  const getDisplayItems = () => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    const startItems = items.slice(0, 1);
    const endItems = items.slice(-maxItems + 1);
    const middleItem = {
      label: collapsedText,
      href: '',
      collapsed: true,
    } as BreadcrumbItem & { collapsed: boolean };

    return [...startItems, middleItem, ...endItems];
  };

  const displayItems = getDisplayItems();

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb navigation">
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCurrent = item.current || isLast;
          const isCollapsed = 'collapsed' in item && item.collapsed;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span
                  className={cn('mx-2 text-gray-400 select-none', separatorClassName)}
                  aria-hidden="true"
                >
                  {typeof separator === 'string' ? separator : separator}
                </span>
              )}

              {isCollapsed ? (
                <span
                  className={cn('px-2 py-1 text-sm text-gray-500 select-none', itemClassName)}
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              ) : isCurrent ? (
                <span
                  className={cn(
                    'px-2 py-1 text-sm font-medium text-gray-900',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                    currentClassName
                  )}
                  aria-current="page"
                  tabIndex={0}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className={cn(
                    'px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    itemClassName
                  )}
                  onClick={e => {
                    onItemClick?.(item, index);
                  }}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Convenience components for common breadcrumb styles
export function SimpleBreadcrumb(props: Omit<BreadcrumbProps, 'separator'>) {
  return <Breadcrumb {...props} separator="/" />;
}

export function ArrowBreadcrumb(props: Omit<BreadcrumbProps, 'separator'>) {
  return (
    <Breadcrumb
      {...props}
      separator={
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      }
    />
  );
}

export function ChevronBreadcrumb(props: Omit<BreadcrumbProps, 'separator'>) {
  return (
    <Breadcrumb
      {...props}
      separator={
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      }
    />
  );
}

export function DotBreadcrumb(props: Omit<BreadcrumbProps, 'separator'>) {
  return <Breadcrumb {...props} separator="•" />;
}

// Breadcrumb with home icon
export function BreadcrumbWithHome({
  items,
  homeLabel = 'Home',
  homeHref = '/',
  homeIcon,
  ...props
}: BreadcrumbProps & {
  homeLabel?: string;
  homeHref?: string;
  homeIcon?: React.ReactNode;
}) {
  const homeItem: BreadcrumbItem = {
    label: homeLabel,
    href: homeHref,
    icon: homeIcon || (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  };

  return <Breadcrumb {...props} items={[homeItem, ...items]} />;
}

// Auto-generating breadcrumb from current URL
interface AutoBreadcrumbProps extends Omit<BreadcrumbProps, 'items'> {
  basePath?: string;
  transformLabel?: (segment: string) => string;
  excludePaths?: string[];
}

export function AutoBreadcrumb({
  basePath = '/',
  transformLabel = segment => segment.charAt(0).toUpperCase() + segment.slice(1),
  excludePaths = [],
  ...props
}: AutoBreadcrumbProps) {
  const currentPath = window.location.pathname;

  // Generate breadcrumb items from current path
  const generateItems = () => {
    const pathSegments = currentPath
      .replace(basePath, '')
      .split('/')
      .filter(segment => segment && !excludePaths.includes(segment));

    const items: BreadcrumbItem[] = [];
    let currentHref = basePath;

    pathSegments.forEach((segment, index) => {
      currentHref += (index === 0 ? '' : '/') + segment;
      const isLast = index === pathSegments.length - 1;

      items.push({
        label: transformLabel(segment.replace(/-/g, ' ')),
        href: currentHref,
        current: isLast,
      });
    });

    return items;
  };

  return <Breadcrumb {...props} items={generateItems()} />;
}
