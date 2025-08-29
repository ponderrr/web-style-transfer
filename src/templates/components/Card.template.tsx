import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    position?: "top" | "left" | "right" | "background";
  };

  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
  }>;

  // Layout & Styling
  variant?: "default" | "elevated" | "outlined" | "filled" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  layout?: "vertical" | "horizontal";
  padding?: "none" | "sm" | "md" | "lg" | "xl";

  // States
  hoverable?: boolean;
  clickable?: boolean;
  selected?: boolean;
  loading?: boolean;

  // Additional
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

// Size configurations
const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

// Padding configurations
const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

// Action button component
function CardAction({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  size = "md",
  className,
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] px-4";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    ghost:
      "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "text-sm py-2",
    md: "text-base py-2.5",
    lg: "text-lg py-3",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {label}
    </button>
  );
}

// Card image component
function CardImage({
  src,
  alt,
  position = "top",
  className,
}: {
  src: string;
  alt: string;
  position?: "top" | "left" | "right" | "background";
  className?: string;
}) {
  const positionClasses = {
    top: "w-full rounded-t-lg",
    left: "w-24 h-24 sm:w-32 sm:h-32 rounded-l-lg flex-shrink-0",
    right: "w-24 h-24 sm:w-32 sm:h-32 rounded-r-lg flex-shrink-0",
    background: "absolute inset-0 w-full h-full object-cover rounded-lg -z-10",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", positionClasses[position], className)}
      loading="lazy"
    />
  );
}

// Loading skeleton
function CardSkeleton({
  variant = "default",
  layout = "vertical",
  hasImage = false,
  className,
}: {
  variant?: CardProps["variant"];
  layout?: CardProps["layout"];
  hasImage?: boolean;
  className?: string;
}) {
  const variantClasses = {
    default: "border border-gray-200",
    elevated: "shadow-lg border border-gray-200",
    outlined: "border-2 border-gray-300",
    filled: "bg-gray-50 border border-gray-200",
    gradient:
      "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200",
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden animate-pulse",
        variantClasses[variant || "default"],
        className
      )}
      role="presentation"
      aria-hidden="true"
    >
      {hasImage && (
        <div
          className={cn(
            "bg-gray-300",
            layout === "horizontal"
              ? "w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0"
              : "w-full h-48"
          )}
        />
      )}
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-10 bg-gray-300 rounded w-24" />
          <div className="h-10 bg-gray-300 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// Main Card Component
export function Card({
  title,
  subtitle,
  description,
  image,
  primaryAction,
  secondaryAction,
  actions,
  variant = "default",
  size = "md",
  layout = "vertical",
  padding = "md",
  hoverable = false,
  clickable = false,
  selected = false,
  loading = false,
  className,
  children,
  onClick,
  href,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "border border-gray-200 bg-white",
    elevated: "shadow-lg border border-gray-200 bg-white",
    outlined: "border-2 border-gray-300 bg-white",
    filled: "bg-gray-50 border border-gray-200",
    gradient:
      "bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200",
  };

  const interactiveClasses = cn(
    hoverable &&
      "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
    clickable && "cursor-pointer",
    selected && "ring-2 ring-blue-500 ring-offset-2"
  );

  const cardContent = (
    <article
      className={cn(
        "rounded-lg overflow-hidden",
        variantClasses[variant],
        interactiveClasses,
        className
      )}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-selected={selected}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      {...props}
    >
      {loading ? (
        <CardSkeleton variant={variant} layout={layout} hasImage={!!image} />
      ) : (
        <>
          {/* Image */}
          {image && (
            <div
              className={cn(
                "relative",
                layout === "horizontal" && image.position === "left" && "flex",
                layout === "horizontal" &&
                  image.position === "right" &&
                  "flex flex-row-reverse"
              )}
            >
              <CardImage {...image} />
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              paddingClasses[padding],
              layout === "horizontal" && image?.position === "left" && "flex-1",
              layout === "horizontal" && image?.position === "right" && "flex-1"
            )}
          >
            {/* Header */}
            {(title || subtitle) && (
              <header className="mb-4">
                {title && (
                  <h3
                    className={cn(
                      "font-semibold text-gray-900 leading-tight",
                      sizeClasses[size]
                    )}
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                )}
              </header>
            )}

            {/* Description */}
            {description && (
              <p className="text-gray-700 leading-relaxed mb-6">
                {description}
              </p>
            )}

            {/* Custom content */}
            {children && <div className="mb-6">{children}</div>}

            {/* Actions */}
            {(primaryAction || secondaryAction || actions) && (
              <footer className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                {primaryAction && (
                  <CardAction
                    {...primaryAction}
                    size={size === "sm" ? "sm" : "md"}
                  />
                )}
                {secondaryAction && (
                  <CardAction
                    {...secondaryAction}
                    variant="secondary"
                    size={size === "sm" ? "sm" : "md"}
                  />
                )}
                {actions &&
                  actions.map((action, index) => (
                    <CardAction
                      key={index}
                      {...action}
                      size={size === "sm" ? "sm" : "md"}
                    />
                  ))}
              </footer>
            )}
          </div>
        </>
      )}
    </article>
  );

  // If href is provided, wrap in anchor tag
  if (href && !clickable) {
    return (
      <a
        href={href}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label={title ? `View ${title}` : undefined}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

// Export card variants for convenience
export function ElevatedCard(props: Omit<CardProps, "variant">) {
  return <Card {...props} variant="elevated" />;
}

export function OutlinedCard(props: Omit<CardProps, "variant">) {
  return <Card {...props} variant="outlined" />;
}

export function FilledCard(props: Omit<CardProps, "variant">) {
  return <Card {...props} variant="filled" />;
}

export function GradientCard(props: Omit<CardProps, "variant">) {
  return <Card {...props} variant="gradient" />;
}

// Export layout variants
export function HorizontalCard(props: Omit<CardProps, "layout">) {
  return <Card {...props} layout="horizontal" />;
}

// Export interactive variants
export function ClickableCard(props: Omit<CardProps, "clickable">) {
  return <Card {...props} clickable={true} hoverable={true} />;
}

export function HoverableCard(props: Omit<CardProps, "hoverable">) {
  return <Card {...props} hoverable={true} />;
}
