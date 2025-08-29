import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib-utils';

interface Suggestion {
  id: string;
  label: string;
  value: string;
  category?: string;
  icon?: React.ReactNode;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SearchFilter {
  name: string;
  label: string;
  type: 'select' | 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  value?: string | string[];
  placeholder?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
  metadata?: Record<string, string>;
}

interface SearchFormProps {
  // Search input configuration
  placeholder?: string;
  autocomplete?: boolean;
  suggestions?: Suggestion[];
  showSuggestions?: boolean;

  // Filters
  filters?: SearchFilter[];

  // Results configuration
  results?: {
    layout?: 'list' | 'grid';
    pagination?: boolean;
    sorting?: {
      field: string;
      label: string;
      direction: 'asc' | 'desc';
    }[];
  };

  // Callbacks
  onSearch?: (query: string, filters?: Record<string, any>) => void;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onFilterChange?: (filterName: string, value: any) => void;

  // Styling
  className?: string;
  compact?: boolean;

  // Accessibility
  ariaLabel?: string;
  announceResults?: boolean;
}

// Search Input Component
function SearchInput({
  placeholder = 'Search...',
  autocomplete = true,
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onKeyDown,
  suggestions,
  showSuggestions,
  onSuggestionSelect,
  compact = false,
  className,
}: {
  placeholder?: string;
  autocomplete?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  suggestions?: Suggestion[];
  showSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  compact?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions || !showSuggestions) {
      onKeyDown?.(e);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onSuggestionSelect?.(suggestions[selectedIndex]);
          setIsOpen(false);
          setSelectedIndex(-1);
        } else {
          onSubmit(value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        onKeyDown?.(e);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSuggestionSelect?.(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            onFocus?.();
          }}
          onBlur={() => {
            // Delay to allow suggestion clicks
            setTimeout(() => {
              setIsOpen(false);
              setSelectedIndex(-1);
              onBlur?.();
            }, 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete={autocomplete ? 'on' : 'off'}
          className={cn(
            'w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            compact ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base',
            'pr-10', // Space for search icon
            className
          )}
          aria-label="Search input"
          aria-expanded={isOpen && showSuggestions}
          aria-haspopup={showSuggestions ? 'listbox' : undefined}
          aria-autocomplete={showSuggestions ? 'list' : undefined}
          role="searchbox"
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions && showSuggestions && isOpen && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === selectedIndex}
              className={cn(
                'px-4 py-2 cursor-pointer flex items-center gap-2',
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-900'
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.icon && <span>{suggestion.icon}</span>}
              <div className="flex-1">
                <div className="font-medium">{suggestion.label}</div>
                {suggestion.category && (
                  <div className="text-sm text-gray-500">{suggestion.category}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Filter Component
function FilterComponent({
  filter,
  onChange,
  compact = false,
}: {
  filter: SearchFilter;
  onChange: (value: any) => void;
  compact?: boolean;
}) {
  const handleChange = (value: any) => {
    onChange(value);
  };

  switch (filter.type) {
    case 'select':
      return (
        <select
          value={(filter.value as string) || ''}
          onChange={e => handleChange(e.target.value)}
          className={cn(
            'border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            compact ? 'px-2 py-1 text-sm' : 'px-3 py-2'
          )}
          aria-label={filter.label}
        >
          <option value="">{filter.placeholder || `All ${filter.label}`}</option>
          {filter.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} {option.count !== undefined && `(${option.count})`}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{filter.label}</label>
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(filter.value as string[])?.includes(option.value) || false}
                  onChange={e => {
                    const currentValues = (filter.value as string[]) || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleChange(newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{filter.label}</label>
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={filter.name}
                  value={option.value}
                  checked={filter.value === option.value}
                  onChange={e => handleChange(e.target.value)}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function SearchForm({
  placeholder = 'Search...',
  autocomplete = true,
  suggestions = [],
  showSuggestions = true,
  filters = [],
  onSearch,
  onSuggestionSelect,
  onFilterChange,
  className,
  compact = false,
  ariaLabel = 'Search',
}: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when query or filters change
  useEffect(() => {
    if (debouncedQuery || Object.keys(filterValues).length > 0) {
      onSearch?.(debouncedQuery, filterValues);
    }
  }, [debouncedQuery, filterValues, onSearch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleQuerySubmit = (query: string) => {
    onSearch?.(query, filterValues);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.label);
    onSuggestionSelect?.(suggestion);
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [filterName]: value }));
    onFilterChange?.(filterName, value);
  };

  const handleClear = () => {
    setQuery('');
    setFilterValues({});
  };

  return (
    <form
      role="search"
      aria-label={ariaLabel}
      className={cn('w-full', className)}
      onSubmit={e => {
        e.preventDefault();
        handleQuerySubmit(query);
      }}
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder={placeholder}
              autocomplete={autocomplete}
              value={query}
              onChange={handleQueryChange}
              onSubmit={handleQuerySubmit}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onSuggestionSelect={handleSuggestionSelect}
              compact={compact}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className={cn(
              'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              compact ? 'px-3 py-1 text-sm' : 'px-4 py-2'
            )}
            aria-label="Perform search"
          >
            Search
          </button>

          {/* Clear Button */}
          {(query || Object.keys(filterValues).length > 0) && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'px-3 py-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md',
                compact ? 'px-2 py-1 text-sm' : 'px-3 py-2'
              )}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {filters.map(filter => (
              <div key={filter.name} className="min-w-0">
                <FilterComponent
                  filter={{
                    ...filter,
                    value: filterValues[filter.name],
                  }}
                  onChange={value => handleFilterChange(filter.name, value)}
                  compact={compact}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

// Convenience components for common search patterns
export function SimpleSearchForm(props: Omit<SearchFormProps, 'filters'>) {
  return <SearchForm {...props} />;
}

export function AdvancedSearchForm({ filters, ...props }: SearchFormProps) {
  return <SearchForm {...props} filters={filters} />;
}

export function CompactSearchForm(props: Omit<SearchFormProps, 'compact'>) {
  return <SearchForm {...props} compact={true} />;
}

// Search form with live results preview
interface SearchWithResultsProps extends SearchFormProps {
  results?: SearchResult[];
  loading?: boolean;
  error?: string;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchWithResults({
  results = [],
  loading = false,
  error,
  onResultClick,
  ...props
}: SearchWithResultsProps) {
  // Announce results for screen readers
  useEffect(() => {
    if (results.length > 0 && props.announceResults) {
      const announcement = `${results.length} search result${results.length === 1 ? '' : 's'} found`;
      // Use ARIA live region for announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);

      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    }
  }, [results, props.announceResults]);

  return (
    <div className="relative">
      <SearchForm {...props} />

      {/* Live Results */}
      {(loading || results.length > 0 || error) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
              Searching...
            </div>
          )}

          {error && <div className="px-4 py-3 text-sm text-red-600">Error: {error}</div>}

          {!loading && !error && results.length === 0 && props.placeholder && (
            <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
          )}

          {!loading &&
            !error &&
            results.map(result => (
              <a
                key={result.id}
                href={result.url}
                onClick={e => {
                  e.preventDefault();
                  onResultClick?.(result);
                }}
                className="block px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{result.title}</div>
                {result.description && (
                  <div className="text-sm text-gray-600 mt-1">{result.description}</div>
                )}
                {result.category && (
                  <div className="text-xs text-gray-500 mt-1">{result.category}</div>
                )}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
