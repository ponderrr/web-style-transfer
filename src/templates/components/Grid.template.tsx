import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  // Grid configuration
  columns?: number;
  gap?: string;
  rows?: number | 'auto';

  // Responsive breakpoints
  breakpoints?: {
    mobile?: {
      columns: number;
      gap?: string;
    };
    tablet?: {
      columns: number;
      gap?: string;
    };
    desktop?: {
      columns: number;
      gap?: string;
    };
    wide?: {
      columns: number;
      gap?: string;
    };
  };

  // Container settings
  container?: {
    maxWidth?: string;
    padding?: string;
    centered?: boolean;
  };

  // Grid items
  children: React.ReactNode;

  // Styling
  className?: string;
  itemClassName?: string;

  // Accessibility
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

// Grid item component for more control
interface GridItemProps {
  children: React.ReactNode;
  span?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  start?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  className?: string;
}

export function GridItem({ children, span, start, className }: GridItemProps) {
  const getGridColumnStyles = () => {
    const styles: Record<string, string> = {};

    if (span?.mobile) {
      styles['--grid-column-span-mobile'] = `span ${span.mobile}`;
    }
    if (span?.tablet) {
      styles['--grid-column-span-tablet'] = `span ${span.tablet}`;
    }
    if (span?.desktop) {
      styles['--grid-column-span-desktop'] = `span ${span.desktop}`;
    }
    if (span?.wide) {
      styles['--grid-column-span-wide'] = `span ${span.wide}`;
    }

    if (start?.mobile) {
      styles['--grid-column-start-mobile'] = `${start.mobile}`;
    }
    if (start?.tablet) {
      styles['--grid-column-start-tablet'] = `${start.tablet}`;
    }
    if (start?.desktop) {
      styles['--grid-column-start-desktop'] = `${start.desktop}`;
    }
    if (start?.wide) {
      styles['--grid-column-start-wide'] = `${start.wide}`;
    }

    return styles;
  };

  return (
    <div
      className={cn(
        // Base grid item styles
        'col-span-1',

        // Responsive grid column spans
        span?.mobile && `col-span-${span.mobile}`,
        span?.tablet && `md:col-span-${span.tablet}`,
        span?.desktop && `lg:col-span-${span.desktop}`,
        span?.wide && `xl:col-span-${span.wide}`,

        // Responsive grid column starts
        start?.mobile && `[grid-column-start:${start.mobile}]`,
        start?.tablet && `md:[grid-column-start:${start.tablet}]`,
        start?.desktop && `lg:[grid-column-start:${start.desktop}]`,
        start?.wide && `xl:[grid-column-start:${start.wide}]`,

        className
      )}
      style={getGridColumnStyles()}
    >
      {children}
    </div>
  );
}

export function Grid({
  columns = 12,
  gap = '1rem',
  rows = 'auto',
  breakpoints = {
    mobile: { columns: 4, gap: '1rem' },
    tablet: { columns: 8, gap: '1.5rem' },
    desktop: { columns: 12, gap: '2rem' },
  },
  container = {
    maxWidth: '1200px',
    padding: '1rem',
    centered: true,
  },
  children,
  className,
  itemClassName,
  role,
  ariaLabel,
  ariaLabelledBy,
}: GridProps) {
  const gridStyles = {
    '--grid-columns': columns,
    '--grid-gap': gap,
    '--grid-rows': rows === 'auto' ? 'auto' : rows,
    '--container-max-width': container.maxWidth,
    '--container-padding': container.padding,

    // Breakpoint variables
    '--grid-columns-mobile': breakpoints.mobile?.columns || 4,
    '--grid-gap-mobile': breakpoints.mobile?.gap || gap,
    '--grid-columns-tablet': breakpoints.tablet?.columns || 8,
    '--grid-gap-tablet': breakpoints.tablet?.gap || gap,
    '--grid-columns-desktop': breakpoints.desktop?.columns || 12,
    '--grid-gap-desktop': breakpoints.desktop?.gap || gap,
    '--grid-columns-wide': breakpoints.wide?.columns || columns,
    '--grid-gap-wide': breakpoints.wide?.gap || gap,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        // Container styles
        container.centered && 'mx-auto',
        container.maxWidth && 'max-w-[var(--container-max-width)]',
        container.padding && 'px-[var(--container-padding)]',

        className
      )}
      style={gridStyles}
    >
      <div
        className={cn(
          // Grid styles using CSS custom properties
          'grid gap-[var(--grid-gap)]',

          // Base grid columns
          'grid-cols-[var(--grid-columns)]',

          // Responsive grid columns
          breakpoints.mobile && 'grid-cols-[var(--grid-columns-mobile)]',
          breakpoints.tablet && 'md:grid-cols-[var(--grid-columns-tablet)]',
          breakpoints.desktop && 'lg:grid-cols-[var(--grid-columns-desktop)]',
          breakpoints.wide && 'xl:grid-cols-[var(--grid-columns-wide)]',

          // Responsive gap
          breakpoints.mobile && 'gap-[var(--grid-gap-mobile)]',
          breakpoints.tablet && 'md:gap-[var(--grid-gap-tablet)]',
          breakpoints.desktop && 'lg:gap-[var(--grid-gap-desktop)]',
          breakpoints.wide && 'xl:gap-[var(--grid-gap-wide)]',

          // Row handling
          rows === 'auto' ? 'auto-rows-fr' : 'grid-rows-[var(--grid-rows)]'
        )}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

// Convenience components for common grid configurations
export function Grid12(props: Omit<GridProps, 'columns'>) {
  return <Grid {...props} columns={12} />;
}

export function Grid8(props: Omit<GridProps, 'columns'>) {
  return <Grid {...props} columns={8} />;
}

export function Grid4(props: Omit<GridProps, 'columns'>) {
  return <Grid {...props} columns={4} />;
}

// Masonry-like grid (using CSS Grid with dense packing)
export function MasonryGrid({
  children,
  columns = 3,
  gap = '1rem',
  ...props
}: Omit<GridProps, 'rows'>) {
  return (
    <Grid columns={columns} gap={gap} className="grid-flow-dense" {...props}>
      {children}
    </Grid>
  );
}

// Flex-based grid fallback for older browsers
export function FlexGrid({
  children,
  columns = 3,
  gap = '1rem',
  className,
  ...props
}: Omit<GridProps, 'breakpoints'>) {
  return (
    <div className={cn('flex flex-wrap gap-4', className)} {...props}>
      {React.Children.map(children, child => (
        <div
          className={cn(
            'flex-1 min-w-0',
            `basis-[calc(100%/${columns}-(${gap}*${columns - 1})/${columns})]`
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Grid with equal height items
export function EqualHeightGrid(props: GridProps) {
  return <Grid {...props} className="items-stretch" />;
}

// Grid with centered content
export function CenteredGrid(props: GridProps) {
  return <Grid {...props} className="place-items-center" />;
}

// Grid with specific column spans for common layouts
export function TwoColumnGrid({
  left,
  right,
  leftSpan = 8,
  rightSpan = 4,
  ...props
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftSpan?: number;
  rightSpan?: number;
} & Omit<GridProps, 'children'>) {
  return (
    <Grid {...props} columns={12}>
      <GridItem span={{ desktop: leftSpan }}>{left}</GridItem>
      <GridItem span={{ desktop: rightSpan }}>{right}</GridItem>
    </Grid>
  );
}

export function ThreeColumnGrid({
  left,
  center,
  right,
  ...props
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
} & Omit<GridProps, 'children'>) {
  return (
    <Grid {...props} columns={12}>
      <GridItem span={{ desktop: 4 }}>{left}</GridItem>
      <GridItem span={{ desktop: 4 }}>{center}</GridItem>
      <GridItem span={{ desktop: 4 }}>{right}</GridItem>
    </Grid>
  );
}
