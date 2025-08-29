import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ArticleMeta {
  author: string;
  date: string;
  readingTime: string;
  category: string;
  tags?: string[];
}

interface ArticleHeader {
  title: string;
  subtitle?: string;
  meta: ArticleMeta;
}

interface ArticleSection {
  id?: string;
  title?: string;
  content: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

interface ArticleProps {
  // Content structure
  header: ArticleHeader;
  sections: ArticleSection[];
  toc?: {
    enabled?: boolean;
    position?: 'left' | 'right';
    title?: string;
  };
  sidebar?: React.ReactNode;

  // Layout options
  variant?: 'default' | 'with-sidebar' | 'with-toc' | 'minimal';
  maxWidth?: string;

  // Styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  sidebarClassName?: string;
  tocClassName?: string;

  // Callbacks
  onSectionClick?: (sectionId: string) => void;
}

// Table of Contents component
function TableOfContents({
  items,
  title = 'Table of Contents',
  className,
  onItemClick,
}: {
  items: TableOfContentsItem[];
  title?: string;
  className?: string;
  onItemClick?: (id: string) => void;
}) {
  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onItemClick?.(id);
    }
  };

  return (
    <nav className={cn('sticky top-8', className)} aria-label="Table of contents">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={e => handleClick(item.id, e)}
              className={cn(
                'block py-1 text-sm hover:text-blue-600 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                item.level === 2 && 'font-medium text-gray-900',
                item.level === 3 && 'ml-4 text-gray-700',
                item.level === 4 && 'ml-8 text-gray-600',
                item.level >= 5 && 'ml-12 text-gray-500'
              )}
            >
              {item.title}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="mt-1 space-y-1">
                {item.children.map(child => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      onClick={e => handleClick(child.id, e)}
                      className={cn(
                        'block py-1 text-sm hover:text-blue-600 transition-colors ml-4',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                        child.level === 3 && 'text-gray-700',
                        child.level === 4 && 'ml-4 text-gray-600',
                        child.level >= 5 && 'ml-8 text-gray-500'
                      )}
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Article header component
function ArticleHeader({ header, className }: { header: ArticleHeader; className?: string }) {
  return (
    <header className={cn('mb-8', className)}>
      {/* Category */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {header.meta.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {header.title}
      </h1>

      {/* Subtitle */}
      {header.subtitle && (
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">{header.subtitle}</p>
      )}

      {/* Meta information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>By {header.meta.author}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <time dateTime={header.meta.date}>
            {new Date(header.meta.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{header.meta.readingTime} read</span>
        </div>
      </div>

      {/* Tags */}
      {header.meta.tags && header.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {header.meta.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

// Skip to content link for accessibility
function SkipLink() {
  return (
    <a
      href="#article-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-3 rounded-md z-50"
    >
      Skip to article content
    </a>
  );
}

export function ArticleLayout({
  header,
  sections,
  toc,
  sidebar,
  variant = 'default',
  maxWidth = '800px',
  className,
  headerClassName,
  contentClassName,
  sidebarClassName,
  tocClassName,
  onSectionClick,
}: ArticleProps) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);

  // Generate table of contents from sections
  useEffect(() => {
    if (!toc?.enabled) return;

    const generateTocItems = (sections: ArticleSection[]): TableOfContentsItem[] => {
      return sections
        .filter(section => section.title)
        .map((section, index) => ({
          id: section.id || `section-${index}`,
          title: section.title!,
          level: section.level || 2,
        }));
    };

    setTocItems(generateTocItems(sections));
  }, [sections, toc?.enabled]);

  // Determine layout based on variant
  const hasSidebar = variant === 'with-sidebar' && sidebar;
  const hasToc = variant === 'with-toc' && toc?.enabled && tocItems.length > 0;
  const tocPosition = toc?.position || 'right';

  return (
    <article
      className={cn('min-h-screen bg-white', className)}
      itemScope
      itemType="https://schema.org/Article"
    >
      <SkipLink />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            'mx-auto',
            hasSidebar && 'lg:grid lg:grid-cols-4 lg:gap-8',
            hasToc && !hasSidebar && 'lg:grid lg:grid-cols-4 lg:gap-8',
            !hasSidebar && !hasToc && 'max-w-none'
          )}
          style={{ maxWidth: hasSidebar || hasToc ? undefined : maxWidth }}
        >
          {/* Table of Contents - Left Position */}
          {hasToc && tocPosition === 'left' && (
            <aside className="hidden lg:block lg:col-span-1">
              <TableOfContents
                items={tocItems}
                title={toc.title}
                className={tocClassName}
                onItemClick={onSectionClick}
              />
            </aside>
          )}

          {/* Main Content */}
          <main
            id="article-content"
            className={cn(
              'prose prose-lg max-w-none',
              hasSidebar && 'lg:col-span-3',
              hasToc && !hasSidebar && 'lg:col-span-3',
              !hasSidebar && !hasToc && 'mx-auto',
              contentClassName
            )}
            itemProp="articleBody"
          >
            {/* Article Header */}
            <ArticleHeader header={header} className={headerClassName} />

            {/* Article Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const HeadingTag = `h${section.level || 2}` as keyof JSX.IntrinsicElements;
                const sectionId = section.id || `section-${index}`;

                return (
                  <section key={index} id={sectionId}>
                    {section.title && (
                      <HeadingTag className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-8">
                        {section.title}
                      </HeadingTag>
                    )}
                    <div className="text-gray-700 leading-relaxed">{section.content}</div>
                  </section>
                );
              })}
            </div>
          </main>

          {/* Table of Contents - Right Position */}
          {hasToc && tocPosition === 'right' && (
            <aside className="hidden lg:block lg:col-span-1">
              <TableOfContents
                items={tocItems}
                title={toc.title}
                className={tocClassName}
                onItemClick={onSectionClick}
              />
            </aside>
          )}

          {/* Sidebar */}
          {hasSidebar && (
            <aside className={cn('mt-8 lg:mt-0 lg:col-span-1', sidebarClassName)}>{sidebar}</aside>
          )}
        </div>
      </div>

      {/* Mobile Table of Contents */}
      {hasToc && (
        <div className="lg:hidden border-t border-gray-200 mt-8">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <TableOfContents
              items={tocItems}
              title={toc.title}
              className={tocClassName}
              onItemClick={onSectionClick}
            />
          </div>
        </div>
      )}
    </article>
  );
}

// Convenience components for common article layouts
export function ArticleWithSidebar(props: Omit<ArticleProps, 'variant'>) {
  return <ArticleLayout {...props} variant="with-sidebar" />;
}

export function ArticleWithTOC(props: Omit<ArticleProps, 'variant'>) {
  return <ArticleLayout {...props} variant="with-toc" />;
}

export function MinimalArticle(props: Omit<ArticleProps, 'variant'>) {
  return <ArticleLayout {...props} variant="minimal" />;
}

// Article with author bio
interface ArticleWithAuthorProps extends ArticleProps {
  authorBio?: {
    name: string;
    bio: string;
    avatar?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
      icon?: React.ReactNode;
    }>;
  };
}

export function ArticleWithAuthor({ authorBio, ...props }: ArticleWithAuthorProps) {
  const authorSidebar = authorBio ? (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        {authorBio.avatar && (
          <img src={authorBio.avatar} alt={authorBio.name} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{authorBio.name}</h3>
          <p className="text-sm text-gray-600">Author</p>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4">{authorBio.bio}</p>

      {authorBio.socialLinks && authorBio.socialLinks.length > 0 && (
        <div className="flex gap-3">
          {authorBio.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={`Follow ${authorBio.name} on ${link.platform}`}
            >
              {link.icon || link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return <ArticleLayout {...props} variant="with-sidebar" sidebar={authorSidebar} />;
}
