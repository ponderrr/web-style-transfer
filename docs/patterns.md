# UI Pattern Library

## Overview

This comprehensive pattern library documents all UI components, interaction patterns, and design systems supported by our web style transfer system. Each pattern includes specifications, accessibility requirements, and implementation guidelines.

## Navigation Patterns

### Primary Navigation

**Type**: `navigation.primary`

```typescript
interface PrimaryNavigation {
  layout: 'horizontal' | 'vertical';
  position: 'top' | 'left' | 'bottom';
  items: NavigationItem[];
  responsive: {
    mobile: 'hamburger' | 'bottom-tabs';
    tablet: 'horizontal' | 'vertical';
    desktop: 'horizontal';
  };
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  active?: boolean;
  disabled?: boolean;
}
```

**Accessibility Requirements**:

- Semantic `<nav>` element with `aria-label`
- Keyboard navigation with Tab/Arrow keys
- Focus management for submenus
- Screen reader announcements for state changes
- Skip links for main content

**Implementation**:

```html
<nav aria-label="Main navigation">
  <ul class="nav-list">
    <li class="nav-item">
      <a href="/" class="nav-link" aria-current="page">Home</a>
    </li>
    <li class="nav-item">
      <a href="/about" class="nav-link">About</a>
    </li>
  </ul>
</nav>
```

### Breadcrumb Navigation

**Type**: `navigation.breadcrumb`

```typescript
interface BreadcrumbNavigation {
  items: BreadcrumbItem[];
  separator: string;
  maxItems?: number;
  collapsedText?: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
}
```

**Accessibility**:

- ARIA `breadcrumb` role
- Ordered list structure
- Current page marked with `aria-current="page"`

### Footer Navigation

**Type**: `navigation.footer`

```typescript
interface FooterNavigation {
  sections: FooterSection[];
  layout: 'grid' | 'columns';
  columns: number;
}

interface FooterSection {
  title: string;
  links: NavigationItem[];
}
```

## Hero Patterns

### Full-Width Hero

**Type**: `hero.full-width`

```typescript
interface FullWidthHero {
  background: {
    type: 'image' | 'video' | 'gradient' | 'color';
    src?: string;
    overlay?: string;
  };
  content: {
    headline: string;
    subheadline?: string;
    cta: CallToAction;
    alignment: 'left' | 'center' | 'right';
  };
  height: 'viewport' | 'auto' | 'fixed';
}
```

**Accessibility Requirements**:

- High contrast text over background (WCAG AA compliance)
- Alt text for background images with descriptive content
- Video controls and captions for video backgrounds
- Skip links for screen readers to bypass hero content
- Reduced motion support for animations and transitions
- Semantic heading hierarchy (H1 for main headline)
- Focus management for interactive elements
- Color contrast ratios maintained with background overlays

**Performance Considerations**:

- Lazy load background images
- Optimize video formats (MP4, WebM)
- Use CSS containment for performance
- Implement critical CSS for above-the-fold content

### Centered Hero

**Type**: `hero.centered`

```typescript
interface CenteredHero {
  background: string;
  content: {
    badge?: string;
    headline: string;
    description: string;
    primaryCTA: CallToAction;
    secondaryCTA?: CallToAction;
  };
  layout: 'stacked' | 'inline';
}
```

**Accessibility Requirements**:

- Proper heading hierarchy (H1 for main headline, appropriate levels for others)
- Descriptive button labels with clear call-to-action text
- Focus management for primary and secondary CTAs
- Screen reader friendly content structure with semantic markup
- Keyboard navigation support for all interactive elements
- High contrast ratios for text readability
- Alt text for any background images or media
- Logical tab order through content elements

**Responsive Breakpoints**:

- Mobile: Stacked layout, full width
- Tablet: Centered content, reduced padding
- Desktop: Side-by-side layout when applicable

## Content Patterns

### Article Layout

**Type**: `content.article`

```typescript
interface ArticleLayout {
  header: {
    title: string;
    subtitle?: string;
    meta: {
      author: string;
      date: string;
      readingTime: string;
      category: string;
    };
  };
  content: {
    sections: ContentSection[];
    toc?: TableOfContents;
  };
  sidebar?: SidebarContent;
}
```

**Accessibility Requirements**:

- Proper heading hierarchy (H1-H6) with logical document structure
- Semantic article element for main content
- Skip links for navigation between major content sections
- Table of contents with anchor links and proper heading navigation
- Alt text for all images with descriptive content
- Landmark roles for header, main, and navigation elements
- Focus management when navigating between sections
- Screen reader friendly metadata presentation
- Keyboard navigation support for table of contents
- High contrast for text and metadata elements

**Typography Hierarchy**:

```css
.article-title {
  font-size: 2.5rem;
  line-height: 1.2;
}
.article-subtitle {
  font-size: 1.25rem;
  line-height: 1.4;
}
.article-meta {
  font-size: 0.875rem;
  color: var(--color-neutral-600);
}
.article-content {
  font-size: 1rem;
  line-height: 1.6;
}
```

### Card Grid

**Type**: `content.card-grid`

```typescript
interface CardGrid {
  layout: 'grid' | 'masonry' | 'flex';
  columns: {
    mobile: 1;
    tablet: 2;
    desktop: 3;
    wide: 4;
  };
  gap: string;
  cards: Card[];
}

interface Card {
  image?: CardImage;
  title: string;
  description: string;
  meta?: CardMeta[];
  actions?: CallToAction[];
}
```

**Accessibility Requirements**:

- Semantic article elements for each card
- Descriptive alt text for card images
- Keyboard navigation support between cards
- Focus management for card actions and interactive elements
- Screen reader friendly grid structure with proper landmark roles
- Logical tab order through card content
- High contrast for card text and interactive elements
- Focus indicators that are clearly visible
- Proper heading hierarchy within each card
- ARIA labels for complex card interactions

**Interaction States**:

```scss
.card {
  transition:
    transform 150ms ease-out,
    box-shadow 150ms ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &:focus-within {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
}
```

## Form Patterns

### Contact Form

**Type**: `form.contact`

```typescript
interface ContactForm {
  fields: FormField[];
  validation: ValidationRules;
  submit: {
    text: string;
    loadingText: string;
    successMessage: string;
    errorMessage: string;
  };
  layout: 'stacked' | 'inline';
}

interface FormField {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
}
```

**Accessibility Features**:

- Associated labels with `for` attribute
- ARIA `aria-describedby` for error messages
- Form validation with screen reader announcements
- Keyboard navigation support
- Focus management after submission

### Search Form

**Type**: `form.search`

```typescript
interface SearchForm {
  input: {
    placeholder: string;
    autocomplete: boolean;
    suggestions?: string[];
  };
  filters?: SearchFilter[];
  results?: {
    layout: 'list' | 'grid';
    pagination: boolean;
    sorting: SortOption[];
  };
}
```

**Accessibility Requirements**:

- Search landmark with role="search" for screen reader navigation
- ARIA live region for search results with proper announcement
- Descriptive labels for search input and filter controls
- Keyboard shortcuts support (Enter to search, Escape to clear)
- Screen reader friendly suggestions with proper navigation
- Focus management when opening/closing suggestion dropdowns
- Clear visual focus indicators for all interactive elements
- Proper form structure with associated labels
- Loading states announced to screen readers
- Error states clearly communicated with ARIA attributes

**Progressive Enhancement**:

```javascript
// Enhanced search with JavaScript
const searchInput = document.querySelector('.search-input');
const suggestions = document.querySelector('.search-suggestions');

// Add debounced search suggestions
searchInput.addEventListener('input', debounce(fetchSuggestions, 300));
```

## Interactive Components

### Button System

**Type**: `component.button`

```typescript
interface ButtonSystem {
  variants: {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    outline: ButtonVariant;
    ghost: ButtonVariant;
  };
  sizes: {
    sm: ButtonSize;
    md: ButtonSize;
    lg: ButtonSize;
  };
}

interface ButtonVariant {
  background: string;
  color: string;
  border?: string;
  hover: {
    background: string;
    color?: string;
    transform?: string;
  };
  focus: {
    outline: string;
    outlineOffset: string;
  };
  disabled: {
    opacity: number;
    cursor: 'not-allowed';
  };
}
```

**Design Tokens**:

```json
{
  "button": {
    "primary": {
      "background": { "$value": "#0066cc", "$type": "color" },
      "color": { "$value": "#ffffff", "$type": "color" },
      "hover": {
        "background": { "$value": "#0052a3", "$type": "color" }
      }
    }
  }
}
```

### Modal/Dialog

**Type**: `component.modal`

```typescript
interface ModalComponent {
  trigger: HTMLElement;
  content: {
    title: string;
    body: string | HTMLElement;
    footer?: ModalFooter;
  };
  behavior: {
    backdrop: 'blur' | 'darken' | 'none';
    closeOnBackdrop: boolean;
    closeOnEscape: boolean;
    preventScroll: boolean;
  };
  animations: {
    enter: string;
    exit: string;
    duration: number;
  };
}
```

**Accessibility Implementation**:

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-backdrop" aria-hidden="true"></div>
  <div class="modal-content">
    <h2 id="modal-title">Modal Title</h2>
    <div class="modal-body">
      <!-- Content -->
    </div>
    <div class="modal-footer">
      <button type="button">Close</button>
      <button type="button">Confirm</button>
    </div>
  </div>
</div>
```

### Tabs Component

**Type**: `component.tabs`

```typescript
interface TabsComponent {
  tabs: TabItem[];
  orientation: 'horizontal' | 'vertical';
  behavior: 'manual' | 'automatic';
  activation: 'onClick' | 'onHover';
}

interface TabItem {
  id: string;
  label: string;
  content: HTMLElement;
  disabled?: boolean;
  icon?: string;
}
```

**Keyboard Navigation**:

- Tab: Move focus to next tab
- Shift+Tab: Move focus to previous tab
- Enter/Space: Activate focused tab
- Arrow keys: Navigate between tabs

## Layout Patterns

### Sidebar Layout

**Type**: `layout.sidebar`

```typescript
interface SidebarLayout {
  sidebar: {
    width: string;
    position: 'left' | 'right';
    collapsible: boolean;
    overlay: boolean;
  };
  main: {
    padding: string;
    maxWidth?: string;
  };
  breakpoints: {
    mobile: 'overlay' | 'hidden';
    tablet: 'collapsed' | 'expanded';
    desktop: 'expanded';
  };
}
```

**Accessibility Requirements**:

- Skip links for main content navigation
- Proper focus management when sidebar toggles open/close
- Screen reader announcements for state changes (expanded/collapsed)
- Keyboard navigation support for sidebar controls
- Semantic landmark roles (complementary for sidebar, main for content)
- Focus trapping when overlay is active on mobile
- Logical tab order that flows from sidebar to main content
- High contrast toggle buttons and focus indicators
- ARIA expanded/collapsed states for collapsible elements

**Responsive Behavior**:

```scss
.sidebar {
  @media (max-width: 767px) {
    position: fixed;
    transform: translateX(-100%);
    &.open {
      transform: translateX(0);
    }
  }
}
```

### Grid System

**Type**: `layout.grid`

```typescript
interface GridSystem {
  columns: number;
  gap: string;
  breakpoints: {
    mobile: { columns: 4; gap: '1rem' };
    tablet: { columns: 8; gap: '1.5rem' };
    desktop: { columns: 12; gap: '2rem' };
  };
  container: {
    maxWidth: '1200px';
    padding: '1rem';
  };
}
```

**Accessibility Requirements**:

- Logical content flow in source order matching visual order
- Proper heading hierarchy maintained across grid items
- Screen reader friendly grid structure with clear navigation
- Focus management within grid layouts (tab order, arrow key navigation)
- Semantic grouping of related grid items
- Descriptive labels for complex grid interactions
- Keyboard navigation support for grid-based interfaces
- High contrast for grid borders and interactive elements
- Alt text and semantic markup for grid item content
- Responsive design that maintains usability across breakpoints

**CSS Grid Implementation**:

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gap);
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--container-padding);
}
```

## Animation Patterns

### Page Transitions

**Type**: `animation.page-transition`

```typescript
interface PageTransition {
  type: 'fade' | 'slide' | 'scale' | 'wipe';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration: number;
  easing: string;
  stagger?: {
    elements: string;
    delay: number;
  };
}
```

**Performance Considerations**:

- Use `transform` and `opacity` for GPU acceleration
- Avoid animating layout properties
- Respect `prefers-reduced-motion`
- Implement will-change for animated elements

### Micro-interactions

**Type**: `animation.micro-interaction`

```typescript
interface MicroInteraction {
  trigger: 'hover' | 'focus' | 'click' | 'scroll';
  target: string;
  properties: {
    scale?: number;
    rotate?: number;
    translate?: [number, number];
    opacity?: number;
  };
  duration: number;
  easing: string;
}
```

**Implementation**:

```scss
.button {
  transition: transform 150ms ease-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}
```

This pattern library provides comprehensive specifications for all UI components and interaction patterns in our web style transfer system. Each pattern includes accessibility requirements, performance considerations, and implementation guidelines to ensure consistent, high-quality user experiences.
