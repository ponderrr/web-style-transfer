import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabsProps {
  // Content
  tabs: TabItem[];
  defaultActiveTab?: string;

  // Configuration
  orientation?: 'horizontal' | 'vertical';
  activation?: 'onClick' | 'onHover';
  variant?: 'default' | 'pills' | 'underline';

  // Styling
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  contentClassName?: string;

  // Callbacks
  onTabChange?: (tabId: string) => void;
}

// Tab trigger button component
function TabTrigger({
  tab,
  isActive,
  isDisabled,
  orientation,
  activation,
  variant,
  onClick,
  onKeyDown,
  className,
}: {
  tab: TabItem;
  isActive: boolean;
  isDisabled: boolean;
  orientation: 'horizontal' | 'vertical';
  activation: 'onClick' | 'onHover';
  variant: 'default' | 'pills' | 'underline';
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  className?: string;
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] px-4 py-2';

  const variantClasses = {
    default: cn(
      'border-b-2 rounded-t-md',
      isActive
        ? 'border-blue-500 bg-blue-50 text-blue-700'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    ),
    pills: cn(
      'rounded-md',
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    ),
    underline: cn(
      'border-b-2 rounded-none',
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    ),
  };

  const orientationClasses = {
    horizontal: 'text-sm',
    vertical: 'text-sm w-full justify-start',
  };

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      aria-disabled={isDisabled}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        baseClasses,
        variantClasses[variant],
        orientationClasses[orientation],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={isDisabled ? undefined : onKeyDown}
      disabled={isDisabled}
    >
      {tab.icon && <span className="mr-2">{tab.icon}</span>}
      {tab.label}
    </button>
  );
}

// Tab panel component
function TabPanel({
  tab,
  isActive,
  className,
}: {
  tab: TabItem;
  isActive: boolean;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      aria-hidden={!isActive}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md',
        !isActive && 'hidden',
        className
      )}
      tabIndex={-1}
    >
      {tab.content}
    </div>
  );
}

export function Tabs({
  tabs,
  defaultActiveTab,
  orientation = 'horizontal',
  activation = 'onClick',
  variant = 'default',
  className,
  tabListClassName,
  tabClassName,
  contentClassName,
  onTabChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id || '');
  const tabListRef = useRef<HTMLDivElement>(null);

  // Update active tab when defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  // Handle tab activation
  const handleTabActivation = useCallback(
    (tabId: string) => {
      if (activeTab !== tabId) {
        setActiveTab(tabId);
        onTabChange?.(tabId);
      }
    },
    [activeTab, onTabChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentTabId: string) => {
      const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
      const enabledTabs = tabs.filter(tab => !tab.disabled);

      if (enabledTabs.length === 0) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            // Skip disabled tabs
            while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
              nextIndex = nextIndex > 0 ? nextIndex - 1 : tabs.length - 1;
            }
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault();
            nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            // Skip disabled tabs
            while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
              nextIndex = nextIndex < tabs.length - 1 ? nextIndex + 1 : 0;
            }
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            // Skip disabled tabs
            while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
              nextIndex = nextIndex > 0 ? nextIndex - 1 : tabs.length - 1;
            }
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault();
            nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            // Skip disabled tabs
            while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
              nextIndex = nextIndex < tabs.length - 1 ? nextIndex + 1 : 0;
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          while (tabs[nextIndex]?.disabled && nextIndex < tabs.length - 1) {
            nextIndex++;
          }
          break;
        case 'End':
          e.preventDefault();
          nextIndex = tabs.length - 1;
          while (tabs[nextIndex]?.disabled && nextIndex > 0) {
            nextIndex--;
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleTabActivation(currentTabId);
          return;
        default:
          return;
      }

      if (nextIndex !== currentIndex && tabs[nextIndex] && !tabs[nextIndex].disabled) {
        handleTabActivation(tabs[nextIndex].id);

        // Focus the next tab button
        setTimeout(() => {
          const nextTabButton = document.getElementById(`tab-${tabs[nextIndex].id}`);
          if (nextTabButton) {
            nextTabButton.focus();
          }
        }, 0);
      }
    },
    [tabs, orientation, handleTabActivation]
  );

  // Handle mouse events based on activation type
  const handleMouseEvent = (tabId: string) => {
    if (activation === 'onClick') {
      handleTabActivation(tabId);
    }
  };

  const handleMouseEnter = (tabId: string) => {
    if (activation === 'onHover') {
      handleTabActivation(tabId);
    }
  };

  const tabListClasses = cn(
    'flex border-b border-gray-200',
    orientation === 'vertical' && 'flex-col border-b-0 border-r border-gray-200 w-64',
    tabListClassName
  );

  const tabContentClasses = cn(
    'mt-4',
    orientation === 'vertical' && 'ml-4 flex-1',
    contentClassName
  );

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation={orientation}
        className={tabListClasses}
      >
        {tabs.map(tab => (
          <TabTrigger
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            isDisabled={tab.disabled || false}
            orientation={orientation}
            activation={activation}
            variant={variant}
            onClick={() => handleMouseEvent(tab.id)}
            onKeyDown={e => handleKeyDown(e, tab.id)}
            className={tabClassName}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className={tabContentClasses}>
        {tabs.map(tab => (
          <TabPanel
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            className={contentClassName}
          />
        ))}
      </div>
    </div>
  );
}

// Convenience components for common tab layouts
export function HorizontalTabs(props: Omit<TabsProps, 'orientation'>) {
  return <Tabs {...props} orientation="horizontal" />;
}

export function VerticalTabs(props: Omit<TabsProps, 'orientation'>) {
  return <Tabs {...props} orientation="vertical" />;
}

export function PillTabs(props: Omit<TabsProps, 'variant'>) {
  return <Tabs {...props} variant="pills" />;
}

export function UnderlineTabs(props: Omit<TabsProps, 'variant'>) {
  return <Tabs {...props} variant="underline" />;
}
