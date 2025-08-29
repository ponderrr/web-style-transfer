import React from 'react';
import { cn } from '@/lib/utils';

interface CardImage {
  src: string;
  alt: string;
  position?: 'top' | 'left' | 'right' | 'background';
}

interface CardMeta {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface CardAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface CardData {
  id?: string;
  image?: CardImage;
  title?: string;
  subtitle?: string;
  description?: string;
  meta?: CardMeta[];
  actions?: CardAction[];
  badge?: string;
  featured?: boolean;
  href?: string;
  className?: string;
}

interface CardGridProps {
  // Data
  cards: CardData[];

  // Layout
  layout?: 'grid' | 'masonry' | 'flex';
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: string;

  // Card configuration
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';

  // Features
  featuredFirst?: boolean;
  loadMore?: {
    enabled: boolean;
    text: string;
    onLoadMore: () => void;
    loading?: boolean;
  };

  // Styling
  className?: string;
  cardClassName?: string;

  // Callbacks
  onCardClick?: (card: CardData) => void;
  onActionClick?: (action: CardAction, card: CardData) => void;
}

// Individual Card Component
function Card({
  card,
  variant = 'default',
  size = 'md',
  layout = 'grid',
  onCardClick,
  onActionClick,
  className,
}: {
  card: CardData;
  variant: 'default' | 'elevated' | 'outlined' | 'filled';
  size: 'sm' | 'md' | 'lg';
  layout: 'grid' | 'masonry' | 'flex';
  onCardClick?: (card: CardData) => void;
  onActionClick?: (action: CardAction, card: CardData) => void;
  className?: string;
}) {
  const handleCardClick = () => {
    if (card.href) {
      window.location.href = card.href;
    } else {
      onCardClick?.(card);
    }
  };

  const handleActionClick = (action: CardAction, e: React.MouseEvent) => {
    e.stopPropagation();
    onActionClick?.(action, card);
    if (!action.disabled) {
      action.onClick();
    }
  };

  const cardVariants = {
    default: 'border border-gray-200 bg-white',
    elevated: 'shadow-lg border border-gray-200 bg-white',
    outlined: 'border-2 border-gray-300 bg-white',
    filled: 'bg-gray-50 border border-gray-200',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const isClickable = !!card.href || !!onCardClick;

  const cardContent = (
    <article
      className={cn(
        'rounded-lg overflow-hidden transition-all duration-200',
        cardVariants[variant],
        isClickable && 'cursor-pointer hover:shadow-lg hover:-translate-y-1',
        card.featured && 'ring-2 ring-blue-500',
        className
      )}
      onClick={isClickable ? handleCardClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={e => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={card.title ? `View ${card.title}` : undefined}
    >
      {/* Badge */}
      {card.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            {card.badge}
          </span>
        </div>
      )}

      {/* Image */}
      {card.image && (
        <div
          className={cn(
            'relative',
            card.image.position === 'background' && 'h-48',
            card.image.position === 'top' && 'w-full',
            card.image.position === 'left' && 'w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0',
            card.image.position === 'right' && 'w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 order-2'
          )}
        >
          <img
            src={card.image.src}
            alt={card.image.alt}
            className={cn(
              'object-cover rounded-t-lg',
              card.image.position === 'background' &&
                'absolute inset-0 w-full h-full -z-10 rounded-lg',
              card.image.position === 'top' && 'w-full h-48',
              card.image.position === 'left' && 'h-full rounded-l-lg',
              card.image.position === 'right' && 'h-full rounded-r-lg'
            )}
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Header */}
        {(card.title || card.subtitle) && (
          <header className="mb-3">
            {card.title && (
              <h3 className="font-semibold text-gray-900 leading-tight mb-1">{card.title}</h3>
            )}
            {card.subtitle && <p className="text-sm text-gray-600">{card.subtitle}</p>}
          </header>
        )}

        {/* Description */}
        {card.description && (
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{card.description}</p>
        )}

        {/* Meta */}
        {card.meta && card.meta.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {card.meta.map((meta, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
                {meta.icon && <span>{meta.icon}</span>}
                <span>
                  {meta.label}: {meta.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {card.actions && card.actions.length > 0 && (
          <footer className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {card.actions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[32px]',
                  action.variant === 'primary' &&
                    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
                  action.variant === 'secondary' &&
                    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
                  action.variant === 'ghost' &&
                    'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={e => handleActionClick(action, e)}
                disabled={action.disabled}
                aria-label={action.label}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </footer>
        )}
      </div>
    </article>
  );

  // If href is provided, wrap in anchor tag
  if (card.href && !isClickable) {
    return (
      <a
        href={card.href}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label={card.title ? `View ${card.title}` : undefined}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

// Load More Button Component
function LoadMoreButton({
  text,
  onLoadMore,
  loading = false,
  className,
}: {
  text: string;
  onLoadMore: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className="flex justify-center mt-8">
      <button
        type="button"
        className={cn(
          'inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        onClick={onLoadMore}
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        {loading ? 'Loading...' : text}
      </button>
    </div>
  );
}

export function CardGrid({
  cards,
  layout = 'grid',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = '1rem',
  variant = 'default',
  size = 'md',
  featuredFirst = false,
  loadMore,
  className,
  cardClassName,
  onCardClick,
  onActionClick,
}: CardGridProps) {
  // Sort cards if featured first
  const sortedCards = featuredFirst
    ? [...cards].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    : cards;

  const gridStyles = {
    '--grid-gap': gap,
    '--grid-columns-mobile': columns.mobile || 1,
    '--grid-columns-tablet': columns.tablet || 2,
    '--grid-columns-desktop': columns.desktop || 3,
    '--grid-columns-wide': columns.wide || 4,
  } as React.CSSProperties;

  return (
    <div className={cn('w-full', className)} style={gridStyles}>
      <div
        className={cn(
          // Base grid styles
          layout === 'grid' && 'grid gap-[var(--grid-gap)]',
          layout === 'masonry' &&
            'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-[var(--grid-gap)]',
          layout === 'flex' && 'flex flex-wrap gap-[var(--grid-gap)]',

          // Responsive columns for grid layout
          layout === 'grid' && [
            `grid-cols-[var(--grid-columns-mobile)]`,
            `md:grid-cols-[var(--grid-columns-tablet)]`,
            `lg:grid-cols-[var(--grid-columns-desktop)]`,
            `xl:grid-cols-[var(--grid-columns-wide)]`,
          ]
        )}
        role="grid"
        aria-label="Card grid"
      >
        {sortedCards.map((card, index) => (
          <div
            key={card.id || index}
            role="gridcell"
            className={cn(
              layout === 'masonry' && 'break-inside-avoid mb-[var(--grid-gap)]',
              layout === 'flex' && 'flex-1 min-w-0 max-w-xs',
              cardClassName
            )}
          >
            <Card
              card={card}
              variant={variant}
              size={size}
              layout={layout}
              onCardClick={onCardClick}
              onActionClick={onActionClick}
              className={card.className}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {loadMore?.enabled && (
        <LoadMoreButton
          text={loadMore.text}
          onLoadMore={loadMore.onLoadMore}
          loading={loadMore.loading}
        />
      )}
    </div>
  );
}

// Convenience components for common grid layouts
export function GridCardGrid(props: Omit<CardGridProps, 'layout'>) {
  return <CardGrid {...props} layout="grid" />;
}

export function MasonryCardGrid(props: Omit<CardGridProps, 'layout'>) {
  return <CardGrid {...props} layout="masonry" />;
}

export function FlexCardGrid(props: Omit<CardGridProps, 'layout'>) {
  return <CardGrid {...props} layout="flex" />;
}

export function FeaturedCardGrid(props: Omit<CardGridProps, 'featuredFirst'>) {
  return <CardGrid {...props} featuredFirst={true} />;
}

// Card grid with search and filtering
interface FilterableCardGridProps extends CardGridProps {
  search?: {
    placeholder: string;
    onSearch: (query: string) => void;
  };
  filters?: {
    label: string;
    options: Array<{ value: string; label: string }>;
    onFilter: (value: string) => void;
  }[];
}

export function FilterableCardGrid({ search, filters, ...props }: FilterableCardGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search?.onSearch(query);
  };

  const handleFilter = (filterLabel: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterLabel]: value }));
    const filter = filters?.find(f => f.label === filterLabel);
    filter?.onFilter(value);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {search && (
          <div className="flex-1">
            <input
              type="search"
              placeholder={search.placeholder}
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search cards"
            />
          </div>
        )}

        {filters && filters.length > 0 && (
          <div className="flex gap-2">
            {filters.map((filter, index) => (
              <select
                key={index}
                value={activeFilters[filter.label] || ''}
                onChange={e => handleFilter(filter.label, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Filter by ${filter.label}`}
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Card Grid */}
      <CardGrid {...props} />
    </div>
  );
}
