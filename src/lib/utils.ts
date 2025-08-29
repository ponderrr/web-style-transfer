import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge and deduplicate class names
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Format date for input fields (ISO string)
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Create URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Ensure URL has protocol
 */
export function ensureHttps(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + suffix
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert string to title case
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Check if email is valid format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T

  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (!obj) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  if (typeof obj === 'string') return obj.trim().length === 0
  return false
}

/**
 * Get nested object property safely
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result == null) return defaultValue
    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

/**
 * Set nested object property safely
 */
export function set(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let current = obj

  for (const key of keys) {
    if (!(key in current) || current[key] == null) {
      current[key] = {}
    }
    current = current[key]
  }

  current[lastKey] = value
  return obj
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) groups[group] = []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Create range array
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i)
    }
  }
  return result
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1)
}

/**
 * Check if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate percentage of value
 */
export function percentOf(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str)
}

/**
 * Check if string contains only letters
 */
export function isAlpha(str: string): boolean {
  return /^[A-Za-z]+$/.test(str)
}

/**
 * Check if string contains only alphanumeric characters
 */
export function isAlphanumeric(str: string): boolean {
  return /^[A-Za-z0-9]+$/.test(str)
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  }
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m])
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Generate color from string (simple hash)
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

/**
 * Lighten color by percentage
 */
export function lightenColor(color: string, percent: number): string {
  // Simple implementation - for production, use a proper color library
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt

  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1)
}

/**
 * Darken color by percentage
 */
export function darkenColor(color: string, percent: number): string {
  return lightenColor(color, -percent)
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified implementation - for production, use a proper color library
  // This is a basic approximation
  return 4.5 // WCAG AA threshold
}

/**
 * Check if color combination meets contrast requirements
 */
export function hasGoodContrast(fgColor: string, bgColor: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(fgColor, bgColor)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

/**
 * Animation utilities
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce'
}

/**
 * Focus utilities for accessibility
 */
export const focusStyles = {
  default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  inset: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
  visible: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus-visible'
}

/**
 * Screen reader utilities
 */
export const srOnly = 'sr-only'
export const notSrOnly = 'not-sr-only'

/**
 * Print utilities
 */
export const printHidden = 'print:hidden'
export const printVisible = 'print:block'

/**
 * Container utilities
 */
export function getContainerClasses(maxWidth: string = '7xl'): string {
  return `mx-auto max-w-${maxWidth} px-4 sm:px-6 lg:px-8`
}

/**
 * Responsive utilities
 */
export const responsive = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)'
}

/**
 * Z-index scale
 */
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90',
  100: '100'
}

/**
 * Spacing scale utilities
 */
export function getSpacingValue(scale: number, base: number = 4): string {
  return `${scale * base}px`
}

/**
 * Font size utilities
 */
export const fontSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl'
}

/**
 * Font weight utilities
 */
export const fontWeights = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black'
}

/**
 * Line height utilities
 */
export const lineHeights = {
  3: 'leading-3',
  4: 'leading-4',
  5: 'leading-5',
  6: 'leading-6',
  7: 'leading-7',
  8: 'leading-8',
  9: 'leading-9',
  10: 'leading-10',
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose'
}

/**
 * Letter spacing utilities
 */
export const letterSpacing = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest'
}

/**
 * Border radius utilities
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full'
}

/**
 * Shadow utilities
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none'
}

/**
 * Opacity utilities
 */
export const opacity = {
  0: 'opacity-0',
  5: 'opacity-5',
  10: 'opacity-10',
  20: 'opacity-20',
  25: 'opacity-25',
  30: 'opacity-30',
  40: 'opacity-40',
  50: 'opacity-50',
  60: 'opacity-60',
  70: 'opacity-70',
  75: 'opacity-75',
  80: 'opacity-80',
  90: 'opacity-90',
  95: 'opacity-95',
  100: 'opacity-100'
}

/**
 * Transition utilities
 */
export const transitions = {
  none: 'transition-none',
  all: 'transition-all',
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  shadow: 'transition-shadow',
  transform: 'transition-transform'
}

/**
 * Duration utilities
 */
export const durations = {
  75: 'duration-75',
  100: 'duration-100',
  150: 'duration-150',
  200: 'duration-200',
  300: 'duration-300',
  500: 'duration-500',
  700: 'duration-700',
  1000: 'duration-1000'
}

/**
 * Easing utilities
 */
export const easings = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  'in-out': 'ease-in-out'
}

/**
 * Display utilities
 */
export const displays = {
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  hidden: 'hidden'
}

/**
 * Position utilities
 */
export const positions = {
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  relative: 'relative',
  sticky: 'sticky'
}

/**
 * Overflow utilities
 */
export const overflows = {
  auto: 'overflow-auto',
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  scroll: 'overflow-scroll',
  x: {
    auto: 'overflow-x-auto',
    hidden: 'overflow-x-hidden',
    visible: 'overflow-x-visible',
    scroll: 'overflow-x-scroll'
  },
  y: {
    auto: 'overflow-y-auto',
    hidden: 'overflow-y-hidden',
    visible: 'overflow-y-visible',
    scroll: 'overflow-y-scroll'
  }
}

/**
 * Object fit utilities
 */
export const objectFits = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down'
}

/**
 * Cursor utilities
 */
export const cursors = {
  auto: 'cursor-auto',
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
  help: 'cursor-help',
  'not-allowed': 'cursor-not-allowed'
}

/**
 * User select utilities
 */
export const userSelects = {
  none: 'select-none',
  text: 'select-text',
  all: 'select-all',
  auto: 'select-auto'
}

/**
 * Will change utilities
 */
export const willChanges = {
  auto: 'will-change-auto',
  scroll: 'will-change-scroll',
  contents: 'will-change-contents',
  transform: 'will-change-transform'
}

/**
 * Resize utilities
 */
export const resizes = {
  none: 'resize-none',
  y: 'resize-y',
  x: 'resize-x',
  both: 'resize'
}

/**
 * Snap utilities
 */
export const snaps = {
  start: 'snap-start',
  end: 'snap-end',
  center: 'snap-center',
  align: {
    none: 'snap-align-none',
    start: 'snap-align-start',
    end: 'snap-align-end',
    center: 'snap-align-center'
  }
}

/**
 * Touch action utilities
 */
export const touchActions = {
  auto: 'touch-auto',
  none: 'touch-none',
  pan: {
    x: 'touch-pan-x',
    y: 'touch-pan-y',
    left: 'touch-pan-left',
    right: 'touch-pan-right',
    up: 'touch-pan-up',
    down: 'touch-pan-down'
  },
  pinch: 'touch-pinch-zoom'
}

/**
 * Scroll behavior utilities
 */
export const scrollBehaviors = {
  auto: 'scroll-auto',
  smooth: 'scroll-smooth'
}

/**
 * Scroll margin utilities
 */
export function getScrollMargin(value: string): string {
  return `scroll-m-${value}`
}

/**
 * Scroll padding utilities
 */
export function getScrollPadding(value: string): string {
  return `scroll-p-${value}`
}

/**
 * List style utilities
 */
export const listStyles = {
  none: 'list-none',
  disc: 'list-disc',
  decimal: 'list-decimal'
}

/**
 * Appearance utilities
 */
export const appearances = {
  none: 'appearance-none'
}

/**
 * Breakpoint utilities
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

/**
 * Aspect ratio utilities
 */
export const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  auto: 'aspect-auto'
}

/**
 * Grid utilities
 */
export function getGridCols(count: number): string {
  return `grid-cols-${count}`
}

export function getGridRows(count: number): string {
  return `grid-rows-${count}`
}

export function getColSpan(span: number): string {
  return `col-span-${span}`
}

export function getRowSpan(span: number): string {
  return `row-span-${span}`
}

export function getColStart(start: number): string {
  return `col-start-${start}`
}

export function getColEnd(end: number): string {
  return `col-end-${end}`
}

export function getRowStart(start: number): string {
  return `row-start-${start}`
}

export function getRowEnd(end: number): string {
  return `row-end-${end}`
}

/**
 * Flex utilities
 */
export const flexDirections = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse'
}

export const flexWraps = {
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
  'no-wrap': 'flex-nowrap'
}

export const flexItems = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch'
}

export const flexJustifies = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
}

export const flexSelfs = {
  auto: 'self-auto',
  start: 'self-start',
  end: 'self-end',
  center: 'self-center',
  stretch: 'self-stretch',
  baseline: 'self-baseline'
}

/**
 * Gap utilities
 */
export function getGap(size: string): string {
  return `gap-${size}`
}

export function getGapX(size: string): string {
  return `gap-x-${size}`
}

export function getGapY(size: string): string {
  return `gap-y-${size}`
}

/**
 * Space utilities
 */
export function getSpaceX(reverse: boolean = false): string {
  return reverse ? 'space-x-reverse' : 'space-x-0'
}

export function getSpaceY(reverse: boolean = false): string {
  return reverse ? 'space-y-reverse' : 'space-y-0'
}

/**
 * Divide utilities
 */
export function getDivideX(size: string): string {
  return `divide-x-${size}`
}

export function getDivideY(size: string): string {
  return `divide-y-${size}`
}

export const divideStyles = {
  solid: 'divide-solid',
  dashed: 'divide-dashed',
  dotted: 'divide-dotted',
  double: 'divide-double',
  none: 'divide-none'
}

/**
 * Place utilities
 */
export const placeContents = {
  center: 'place-content-center',
  start: 'place-content-start',
  end: 'place-content-end',
  between: 'place-content-between',
  around: 'place-content-around',
  evenly: 'place-content-evenly',
  baseline: 'place-content-baseline',
  stretch: 'place-content-stretch'
}

export const placeItems = {
  start: 'place-items-start',
  end: 'place-items-end',
  center: 'place-items-center',
  baseline: 'place-items-baseline',
  stretch: 'place-items-stretch'
}

export const placeSelfs = {
  auto: 'place-self-auto',
  start: 'place-self-start',
  end: 'place-self-end',
  center: 'place-self-center',
  stretch: 'place-self-stretch'
}

/**
 * Transform utilities
 */
export const transforms = {
  gpu: 'transform-gpu',
  none: 'transform-none'
}

export const transformOrigins = {
  center: 'origin-center',
  top: 'origin-top',
  'top-right': 'origin-top-right',
  right: 'origin-right',
  'bottom-right': 'origin-bottom-right',
  bottom: 'origin-bottom',
  'bottom-left': 'origin-bottom-left',
  left: 'origin-left',
  'top-left': 'origin-top-left'
}

/**
 * Scale utilities
 */
export function getScale(size: number): string {
  return `scale-${size}`
}

export function getScaleX(size: number): string {
  return `scale-x-${size}`
}

export function getScaleY(size: number): string {
  return `scale-y-${size}`
}

/**
 * Rotate utilities
 */
export function getRotate(degrees: number): string {
  return `rotate-${degrees}`
}

/**
 * Translate utilities
 */
export function getTranslate(size: string): string {
  return `translate-x-${size}`
}

export function getTranslateX(size: string): string {
  return `translate-x-${size}`
}

export function getTranslateY(size: string): string {
  return `translate-y-${size}`
}

/**
 * Skew utilities
 */
export function getSkew(degrees: number): string {
  return `skew-x-${degrees}`
}

export function getSkewX(degrees: number): string {
  return `skew-x-${degrees}`
}

export function getSkewY(degrees: number): string {
  return `skew-y-${degrees}`
}

/**
 * Animation utilities
 */
export const animationDelays = {
  75: 'delay-75',
  100: 'delay-100',
  150: 'delay-150',
  200: 'delay-200',
  300: 'delay-300',
  500: 'delay-500',
  700: 'delay-700',
  1000: 'delay-1000'
}

export const animationDurations = {
  75: 'duration-75',
  100: 'duration-100',
  150: 'duration-150',
  200: 'duration-200',
  300: 'duration-300',
  500: 'duration-500',
  700: 'duration-700',
  1000: 'duration-1000'
}

export const animationTimingFunctions = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  'in-out': 'ease-in-out'
}

export const animationFillModes = {
  none: 'fill-mode-none',
  forwards: 'fill-mode-forwards',
  backwards: 'fill-mode-backwards',
  both: 'fill-mode-both'
}

export const animationDirections = {
  normal: 'direction-normal',
  reverse: 'direction-reverse',
  alternate: 'direction-alternate',
  'alternate-reverse': 'direction-alternate-reverse'
}

export const animationPlayStates = {
  running: 'running',
  paused: 'paused'
}

/**
 * Accessibility utilities
 */
export const accessibility = {
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  focus: {
    visible: 'focus-visible',
    within: 'focus-within',
    ring: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    ringInset: 'focus:ring-2 focus:ring-blue-500 focus:ring-inset'
  },
  motion: {
    reduce: 'motion-reduce:transition-none',
    safe: 'motion-safe:transition-all'
  }
}

/**
 * High contrast utilities
 */
export const highContrast = {
  border: '@media (prefers-contrast: high)',
  color: '@media (prefers-contrast: high)',
  scheme: {
    light: '@media (prefers-color-scheme: light)',
    dark: '@media (prefers-color-scheme: dark)'
  }
}

/**
 * Reduced motion utilities
 */
export const reducedMotion = {
  transition: 'motion-reduce:transition-none',
  animation: 'motion-reduce:animation-none',
  transform: 'motion-reduce:transform-none'
}

/**
 * Forced colors utilities
 */
export const forcedColors = {
  active: '@supports (forced-colors: active)',
  none: '@supports (forced-colors: none)'
}

/**
 * Print utilities
 */
export const print = {
  hidden: 'print:hidden',
  visible: 'print:block',
  break: {
    before: 'print:break-before-page',
    after: 'print:break-after-page',
    inside: 'print:break-inside-avoid'
  }
}

/**
 * Selection utilities
 */
export const selections = {
  none: 'selection:bg-transparent',
  auto: 'selection:bg-blue-500 selection:text-white'
}

/**
 * Will change utilities
 */
export const willChange = {
  auto: 'will-change-auto',
  scroll: 'will-change-scroll',
  contents: 'will-change-contents',
  transform: 'will-change-transform',
  opacity: 'will-change-opacity',
  top: 'will-change-top',
  left: 'will-change-left'
}

/**
 * Contain utilities
 */
export const contains = {
  none: 'contain-none',
  content: 'contain-content',
  size: 'contain-size',
  layout: 'contain-layout',
  style: 'contain-style',
  paint: 'contain-paint',
  all: 'contain-all'
}

/**
 * Isolation utilities
 */
export const isolations = {
  auto: 'isolate-auto',
  isolate: 'isolate'
}

/**
 * Mix blend utilities
 */
export const mixBlendModes = {
  normal: 'mix-blend-normal',
  multiply: 'mix-blend-multiply',
  screen: 'mix-blend-screen',
  overlay: 'mix-blend-overlay',
  darken: 'mix-blend-darken',
  lighten: 'mix-blend-lighten',
  'color-dodge': 'mix-blend-color-dodge',
  'color-burn': 'mix-blend-color-burn',
  'hard-light': 'mix-blend-hard-light',
  'soft-light': 'mix-blend-soft-light',
  difference: 'mix-blend-difference',
  exclusion: 'mix-blend-exclusion',
  hue: 'mix-blend-hue',
  saturation: 'mix-blend-saturation',
  color: 'mix-blend-color',
  luminosity: 'mix-blend-luminosity'
}

/**
 * Background blend utilities
 */
export const backgroundBlendModes = {
  normal: 'bg-blend-normal',
  multiply: 'bg-blend-multiply',
  screen: 'bg-blend-screen',
  overlay: 'bg-blend-overlay',
  darken: 'bg-blend-darken',
  lighten: 'bg-blend-lighten',
  'color-dodge': 'bg-blend-color-dodge',
  'color-burn': 'bg-blend-color-burn',
  'hard-light': 'bg-blend-hard-light',
  'soft-light': 'bg-blend-soft-light',
  difference: 'bg-blend-difference',
  exclusion: 'bg-blend-exclusion',
  hue: 'bg-blend-hue',
  saturation: 'bg-blend-saturation',
  color: 'bg-blend-color',
  luminosity: 'bg-blend-luminosity'
}

/**
 * Filter utilities
 */
export const filters = {
  blur: {
    none: 'blur-none',
    sm: 'blur-sm',
    md: 'blur',
    lg: 'blur-lg',
    xl: 'blur-xl',
    '2xl': 'blur-2xl',
    '3xl': 'blur-3xl'
  },
  brightness: {
    0: 'brightness-0',
    50: 'brightness-50',
    75: 'brightness-75',
    90: 'brightness-90',
    95: 'brightness-95',
    100: 'brightness-100',
    105: 'brightness-105',
    110: 'brightness-110',
    125: 'brightness-125',
    150: 'brightness-150',
    200: 'brightness-200'
  },
  contrast: {
    0: 'contrast-0',
    50: 'contrast-50',
    75: 'contrast-75',
    100: 'contrast-100',
    125: 'contrast-125',
    150: 'contrast-150',
    200: 'contrast-200'
  },
  grayscale: {
    0: 'grayscale-0',
    25: 'grayscale',
    50: 'grayscale',
    75: 'grayscale',
    100: 'grayscale'
  },
  'hue-rotate': {
    0: 'hue-rotate-0',
    15: 'hue-rotate-15',
    30: 'hue-rotate-30',
    60: 'hue-rotate-60',
    90: 'hue-rotate-90',
    180: 'hue-rotate-180'
  },
  invert: {
    0: 'invert-0',
    25: 'invert',
    50: 'invert',
    75: 'invert',
    100: 'invert'
  },
  saturate: {
    0: 'saturate-0',
    25: 'saturate-25',
    50: 'saturate-50',
    75: 'saturate-75',
    100: 'saturate-100',
    125: 'saturate-125',
    150: 'saturate-150',
    200: 'saturate-200'
  },
  sepia: {
    0: 'sepia-0',
    25: 'sepia',
    50: 'sepia',
    75: 'sepia',
    100: 'sepia'
  },
  'drop-shadow': {
    sm: 'drop-shadow-sm',
    md: 'drop-shadow',
    lg: 'drop-shadow-lg',
    xl: 'drop-shadow-xl',
    '2xl': 'drop-shadow-2xl',
    none: 'drop-shadow-none'
  }
}

/**
 * Backdrop filter utilities
 */
export const backdropFilters = {
  blur: {
    none: 'backdrop-blur-none',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl'
  },
  brightness: {
    0: 'backdrop-brightness-0',
    50: 'backdrop-brightness-50',
    75: 'backdrop-brightness-75',
    90: 'backdrop-brightness-90',
    95: 'backdrop-brightness-95',
    100: 'backdrop-brightness-100',
    105: 'backdrop-brightness-105',
    110: 'backdrop-brightness-110',
    125: 'backdrop-brightness-125',
    150: 'backdrop-brightness-150',
    200: 'backdrop-brightness-200'
  },
  contrast: {
    0: 'backdrop-contrast-0',
    50: 'backdrop-contrast-50',
    75: 'backdrop-contrast-75',
    100: 'backdrop-contrast-100',
    125: 'backdrop-contrast-125',
    150: 'backdrop-contrast-150',
    200: 'backdrop-contrast-200'
  },
  grayscale: {
    0: 'backdrop-grayscale-0',
    25: 'backdrop-grayscale',
    50: 'backdrop-grayscale',
    75: 'backdrop-grayscale',
    100: 'backdrop-grayscale'
  },
  'hue-rotate': {
    0: 'backdrop-hue-rotate-0',
    15: 'backdrop-hue-rotate-15',
    30: 'backdrop-hue-rotate-30',
    60: 'backdrop-hue-rotate-60',
    90: 'backdrop-hue-rotate-90',
    180: 'backdrop-hue-rotate-180'
  },
  invert: {
    0: 'backdrop-invert-0',
    25: 'backdrop-invert',
    50: 'backdrop-invert',
    75: 'backdrop-invert',
    100: 'backdrop-invert'
  },
  opacity: {
    0: 'backdrop-opacity-0',
    5: 'backdrop-opacity-5',
    10: 'backdrop-opacity-10',
    20: 'backdrop-opacity-20',
    25: 'backdrop-opacity-25',
    30: 'backdrop-opacity-30',
    40: 'backdrop-opacity-40',
    50: 'backdrop-opacity-50',
    60: 'backdrop-opacity-60',
    70: 'backdrop-opacity-70',
    75: 'backdrop-opacity-75',
    80: 'backdrop-opacity-80',
    90: 'backdrop-opacity-90',
    95: 'backdrop-opacity-95',
    100: 'backdrop-opacity-100'
  },
  saturate: {
    0: 'backdrop-saturate-0',
    25: 'backdrop-saturate-25',
    50: 'backdrop-saturate-50',
    75: 'backdrop-saturate-75',
    100: 'backdrop-saturate-100',
    125: 'backdrop-saturate-125',
    150: 'backdrop-saturate-150',
    200: 'backdrop-saturate-200'
  },
  sepia: {
    0: 'backdrop-sepia-0',
    25: 'backdrop-sepia',
    50: 'backdrop-sepia',
    75: 'backdrop-sepia',
    100: 'backdrop-sepia'
  }
}

/**
 * Export all utilities
 */
export default {
  cn,
  formatDate,
  formatDateForInput,
  slugify,
  validateUrl,
  ensureHttps,
  truncate,
  capitalize,
  titleCase,
  generateId,
  debounce,
  throttle,
  validateEmail,
  formatFileSize,
  deepClone,
  isEmpty,
  get,
  set,
  unique,
  uniqueBy,
  shuffle,
  groupBy,
  sortBy,
  range,
  clamp,
  lerp,
  inRange,
  formatNumber,
  formatCurrency,
  formatPercent,
  percentOf,
  isNumeric,
  isAlpha,
  isAlphanumeric,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  camelToKebab,
  kebabToCamel,
  snakeToCamel,
  camelToSnake,
  stringToColor,
  lightenColor,
  darkenColor,
  getContrastRatio,
  hasGoodContrast,
  animations,
  focusStyles,
  srOnly,
  notSrOnly,
  printHidden,
  printVisible,
  getContainerClasses,
  responsive,
  zIndex,
  getSpacingValue,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  borderRadius,
  shadows,
  opacity,
  transitions,
  durations,
  easings,
  displays,
  positions,
  overflows,
  objectFits,
  cursors,
  userSelects,
  willChanges,
  resizes,
  snaps,
  touchActions,
  scrollBehaviors,
  getScrollMargin,
  getScrollPadding,
  listStyles,
  appearances,
  breakpoints,
  aspectRatios,
  getGridCols,
  getGridRows,
  getColSpan,
  getRowSpan,
  getColStart,
  getColEnd,
  getRowStart,
  getRowEnd,
  flexDirections,
  flexWraps,
  flexItems,
  flexJustifies,
  flexSelfs,
  getGap,
  getGapX,
  getGapY,
  getSpaceX,
  getSpaceY,
  getDivideX,
  getDivideY,
  divideStyles,
  placeContents,
  placeItems,
  placeSelfs,
  transforms,
  transformOrigins,
  getScale,
  getScaleX,
  getScaleY,
  getRotate,
  getTranslate,
  getTranslateX,
  getTranslateY,
  getSkew,
  getSkewX,
  getSkewY,
  animationDelays,
  animationDurations,
  animationTimingFunctions,
  animationFillModes,
  animationDirections,
  animationPlayStates,
  accessibility,
  highContrast,
  reducedMotion,
  forcedColors,
  print,
  selections,
  willChange,
  contains,
  isolations,
  mixBlendModes,
  backgroundBlendModes,
  filters,
  backdropFilters
}
