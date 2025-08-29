import React from 'react';
import { cn } from '@/lib/utils';

interface CTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

interface MediaProps {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  className?: string;
}

interface HeroProps {
  // Content
  title: string;
  subtitle?: string;
  description?: string;

  // Actions
  primaryAction?: CTA;
  secondaryAction?: CTA;
  actions?: CTA[];

  // Layout & Styling
  layout: 'centered' | 'split' | 'background-image' | 'video';
  size: 'sm' | 'md' | 'lg' | 'xl';

  // Media
  backgroundImage?: string;
  backgroundVideo?: string;
  media?: MediaProps;

  // Styling
  backgroundColor?: string;
  textColor?: string;
  gradient?: string;

  // Additional
  className?: string;
  children?: React.ReactNode;
}

// Size configurations
const sizeClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-28',
  xl: 'py-28 md:py-36',
};

// Layout components
function CenteredHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  actions,
  size,
  className,
  children,
}: HeroProps) {
  return (
    <section
      className={cn('relative isolate px-6 lg:px-8', sizeClasses[size], className)}
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 id="hero-title" className="text-4xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>

        {subtitle && <p className="mt-6 text-lg leading-8 text-gray-600">{subtitle}</p>}

        {description && (
          <p className="mt-6 text-base leading-7 text-gray-600 max-w-2xl mx-auto">{description}</p>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          {primaryAction && <CTAButton {...primaryAction} />}
          {secondaryAction && <CTAButton {...secondaryAction} />}
          {actions && actions.map((action, index) => <CTAButton key={index} {...action} />)}
        </div>

        {children}
      </div>
    </section>
  );
}

function SplitHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  actions,
  media,
  size,
  className,
  children,
}: HeroProps) {
  return (
    <section
      className={cn('relative isolate', sizeClasses[size], className)}
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h1 id="hero-title" className="text-4xl font-bold tracking-tight sm:text-6xl">
                {title}
              </h1>

              {subtitle && <p className="mt-6 text-lg leading-8 text-gray-600">{subtitle}</p>}

              {description && (
                <p className="mt-6 text-base leading-7 text-gray-600">{description}</p>
              )}

              <div className="mt-10 flex items-center gap-x-6">
                {primaryAction && <CTAButton {...primaryAction} />}
                {secondaryAction && <CTAButton {...secondaryAction} />}
                {actions && actions.map((action, index) => <CTAButton key={index} {...action} />)}
              </div>
            </div>
          </div>

          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              {media && <HeroMedia {...media} />}
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundImageHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  actions,
  backgroundImage,
  size,
  className,
  children,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8',
        sizeClasses[size],
        className
      )}
      aria-labelledby="hero-title"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto max-w-2xl text-center">
        <h1 id="hero-title" className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">{subtitle}</p>
        )}

        {description && (
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-300">{description}</p>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          {primaryAction && <CTAButton {...primaryAction} variant="secondary" />}
          {secondaryAction && <CTAButton {...secondaryAction} variant="ghost" />}
          {actions && actions.map((action, index) => <CTAButton key={index} {...action} />)}
        </div>

        {children}
      </div>
    </section>
  );
}

function VideoHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  actions,
  backgroundVideo,
  size,
  className,
  children,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8',
        sizeClasses[size],
        className
      )}
      aria-labelledby="hero-title"
    >
      {backgroundVideo && (
        <video autoPlay muted loop className="absolute inset-0 -z-10 h-full w-full object-cover">
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto max-w-2xl text-center">
        <h1 id="hero-title" className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">{subtitle}</p>
        )}

        {description && (
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-300">{description}</p>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          {primaryAction && <CTAButton {...primaryAction} variant="secondary" />}
          {secondaryAction && <CTAButton {...secondaryAction} variant="ghost" />}
          {actions && actions.map((action, index) => <CTAButton key={index} {...action} />)}
        </div>

        {children}
      </div>
    </section>
  );
}

// Supporting components
function CTAButton({
  label,
  href,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CTA & { className?: string }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 hover:bg-gray-50 focus:ring-blue-500',
    ghost:
      'bg-transparent text-white border border-white hover:bg-white hover:text-gray-900 focus:ring-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <a
      href={href}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {label}
    </a>
  );
}

function HeroMedia({ type, src, alt, className }: MediaProps) {
  if (type === 'video') {
    return (
      <video autoPlay muted loop className={cn('w-full rounded-xl shadow-xl', className)}>
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return <img src={src} alt={alt || ''} className={cn('w-full rounded-xl shadow-xl', className)} />;
}

// Main Hero Component
export function Hero(props: HeroProps) {
  const { layout } = props;

  switch (layout) {
    case 'centered':
      return <CenteredHero {...props} />;
    case 'split':
      return <SplitHero {...props} />;
    case 'background-image':
      return <BackgroundImageHero {...props} />;
    case 'video':
      return <VideoHero {...props} />;
    default:
      return <CenteredHero {...props} />;
  }
}

// Export layout variants for convenience
export function CenteredHero(props: Omit<HeroProps, 'layout'>) {
  return <Hero {...props} layout="centered" />;
}

export function SplitHero(props: Omit<HeroProps, 'layout'>) {
  return <Hero {...props} layout="split" />;
}

export function BackgroundImageHero(
  props: Omit<HeroProps, 'layout' | 'backgroundImage'> & {
    backgroundImage: string;
  }
) {
  return <Hero {...props} layout="background-image" />;
}

export function VideoHero(
  props: Omit<HeroProps, 'layout' | 'backgroundVideo'> & {
    backgroundVideo: string;
  }
) {
  return <Hero {...props} layout="video" />;
}
