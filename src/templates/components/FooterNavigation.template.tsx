import React from 'react';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  description?: string;
}

interface FooterProps {
  // Content
  sections: FooterSection[];
  brand?: {
    name: string;
    logo?: string;
    tagline?: string;
    href?: string;
  };
  socialLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  copyright?: string;

  // Layout
  layout?: 'grid' | 'columns';
  columns?: number;
  variant?: 'simple' | 'comprehensive' | 'minimal';

  // Styling
  className?: string;
  sectionClassName?: string;
  linkClassName?: string;
  brandClassName?: string;

  // Callbacks
  onLinkClick?: (link: FooterLink, sectionTitle?: string) => void;
}

export function FooterNavigation({
  sections,
  brand,
  socialLinks = [],
  legalLinks = [],
  copyright,
  layout = 'grid',
  columns = 4,
  variant = 'comprehensive',
  className,
  sectionClassName,
  linkClassName,
  brandClassName,
  onLinkClick,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${brand?.name || 'Company'}. All rights reserved.`;

  // Handle external links
  const handleLinkClick = (link: FooterLink, sectionTitle?: string, e?: React.MouseEvent) => {
    onLinkClick?.(link, sectionTitle);

    if (link.external) {
      e?.preventDefault();
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className={cn('bg-gray-900 text-white', className)} role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div
          className={cn(
            layout === 'grid' && 'grid gap-8',
            layout === 'columns' && 'flex flex-wrap gap-8',
            `grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`
          )}
        >
          {/* Brand section */}
          {brand && (
            <div className={cn('space-y-4', brandClassName)}>
              {brand.logo ? (
                <img src={brand.logo} alt={`${brand.name} logo`} className="h-8 w-auto" />
              ) : (
                <h3 className="text-lg font-semibold">{brand.name}</h3>
              )}

              {brand.tagline && <p className="text-gray-400 text-sm max-w-xs">{brand.tagline}</p>}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className={cn(
                        'text-gray-400 hover:text-white transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded',
                        linkClassName
                      )}
                      onClick={e => handleLinkClick(link, 'Social', e)}
                      aria-label={link.ariaLabel || `Follow us on ${link.label}`}
                    >
                      {link.icon || link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer sections */}
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={cn('space-y-4', sectionClassName)}>
              <h4 className="text-sm font-semibold uppercase tracking-wider">{section.title}</h4>

              {section.description && (
                <p className="text-gray-400 text-sm">{section.description}</p>
              )}

              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className={cn(
                        'text-gray-400 hover:text-white transition-colors text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 -m-1',
                        linkClassName
                      )}
                      onClick={e => handleLinkClick(link, section.title, e)}
                      aria-label={link.ariaLabel}
                      {...(link.external && {
                        rel: 'noopener noreferrer',
                        'aria-label': link.ariaLabel || `${link.label} (opens in new tab)`,
                      })}
                    >
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                      {link.label}
                      {link.external && <span className="sr-only"> (opens in new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        {(legalLinks.length > 0 || copyright) && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
              {/* Legal links */}
              {legalLinks.length > 0 && (
                <nav aria-label="Legal navigation">
                  <ul className="flex flex-wrap gap-6">
                    {legalLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className={cn(
                            'text-gray-400 hover:text-white transition-colors text-sm',
                            'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 -m-1',
                            linkClassName
                          )}
                          onClick={e => handleLinkClick(link, 'Legal', e)}
                          aria-label={link.ariaLabel}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Copyright */}
              <p className="text-gray-400 text-sm">{copyright || defaultCopyright}</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

// Convenience components for common footer variants
export function SimpleFooter({
  brand,
  links,
  copyright,
  ...props
}: Omit<FooterProps, 'sections'> & {
  links: FooterLink[];
}) {
  const sections: FooterSection[] = [
    {
      title: 'Links',
      links,
    },
  ];

  return (
    <FooterNavigation
      {...props}
      sections={sections}
      brand={brand}
      copyright={copyright}
      variant="simple"
    />
  );
}

export function MinimalFooter({
  copyright,
  ...props
}: Omit<FooterProps, 'sections' | 'brand' | 'socialLinks'>) {
  return (
    <FooterNavigation
      {...props}
      sections={[]}
      copyright={copyright}
      variant="minimal"
      className="py-6"
    />
  );
}

// Pre-configured footer for common use cases
export function StandardFooter({
  brand,
  mainLinks,
  supportLinks,
  companyLinks,
  socialLinks,
  copyright,
  ...props
}: Omit<FooterProps, 'sections'> & {
  mainLinks?: FooterLink[];
  supportLinks?: FooterLink[];
  companyLinks?: FooterLink[];
}) {
  const sections: FooterSection[] = [];

  if (mainLinks && mainLinks.length > 0) {
    sections.push({
      title: 'Product',
      links: mainLinks,
    });
  }

  if (supportLinks && supportLinks.length > 0) {
    sections.push({
      title: 'Support',
      links: supportLinks,
    });
  }

  if (companyLinks && companyLinks.length > 0) {
    sections.push({
      title: 'Company',
      links: companyLinks,
    });
  }

  return (
    <FooterNavigation
      {...props}
      sections={sections}
      brand={brand}
      socialLinks={socialLinks}
      copyright={copyright}
    />
  );
}

// Footer with newsletter signup
interface NewsletterFooterProps extends FooterProps {
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    onSubscribe: (email: string) => void;
  };
}

export function NewsletterFooter({ newsletter, ...props }: NewsletterFooterProps) {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && newsletter?.onSubscribe) {
      newsletter.onSubscribe(email);
      setEmail('');
    }
  };

  if (!newsletter) {
    return <FooterNavigation {...props} />;
  }

  const newsletterSection: FooterSection = {
    title: newsletter.title,
    description: newsletter.description,
    links: [], // Newsletter form will be added separately
  };

  return (
    <footer className={cn('bg-gray-900 text-white', props.className)} role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter section */}
        <div className="mb-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">{newsletter.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{newsletter.description}</p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {newsletter.buttonText}
              </button>
            </form>
          </div>
        </div>

        {/* Rest of the footer */}
        <FooterNavigation {...props} />
      </div>
    </footer>
  );
}
