import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableRow<T = any> {
  id: string | number;
  data: T;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

interface TableProps<T = any> {
  // Data
  columns: TableColumn<T>[];
  rows: TableRow<T>[];
  loading?: boolean;

  // Selection
  selectable?: boolean;
  multiSelect?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;

  // Sorting
  defaultSort?: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort?: (key: string, direction: "asc" | "desc") => void;

  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    showPageSizeSelector?: boolean;
    pageSizeOptions?: number[];
    onPageSizeChange?: (pageSize: number) => void;
  };

  // Layout & Styling
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "striped" | "minimal";
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;

  // Actions
  actions?: {
    label: string;
    onClick: (row: TableRow<T>) => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    icon?: React.ReactNode;
  }[];

  // Empty state
  emptyState?: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  };

  // Additional
  className?: string;
  rowClassName?: (row: TableRow<T>, index: number) => string;
  onRowClick?: (row: TableRow<T>, index: number) => void;
}

// Sort direction type
type SortDirection = "asc" | "desc" | null;

// Table context for managing table state
interface TableContextValue<T = any> {
  columns: TableColumn<T>[];
  selectable: boolean;
  multiSelect: boolean;
  selectedRows: (string | number)[];
  sortKey: string | null;
  sortDirection: SortDirection;
  handleSort: (key: string) => void;
  handleRowSelect: (rowId: string | number, selected: boolean) => void;
  handleSelectAll: (selected: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
}

const TableContext = React.createContext<TableContextValue | null>(null);

function useTableContext() {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a Table");
  }
  return context;
}

// Sort button component
function SortButton({
  column,
  children,
  className,
}: {
  column: TableColumn;
  children: React.ReactNode;
  className?: string;
}) {
  const { sortKey, sortDirection, handleSort } = useTableContext();

  if (!column.sortable) {
    return <span className={className}>{children}</span>;
  }

  const isActive = sortKey === column.key;
  const direction = isActive ? sortDirection : null;

  return (
    <button
      type="button"
      onClick={() => handleSort(column.key as string)}
      className={cn(
        "inline-flex items-center space-x-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 -mx-1",
        isActive ? "text-gray-900" : "text-gray-700",
        className
      )}
      aria-label={`Sort by ${column.header}${direction ? ` ${direction === "asc" ? "ascending" : "descending"}` : ""}`}
    >
      <span>{children}</span>
      <svg
        className={cn(
          "h-4 w-4 transition-transform",
          direction === "desc" && "rotate-180",
          !direction && "opacity-0 group-hover:opacity-50"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    </button>
  );
}

// Checkbox component for selection
function SelectionCheckbox({
  checked,
  indeterminate,
  onChange,
  disabled,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      ref={(el) => {
        if (el && indeterminate !== undefined) {
          el.indeterminate = indeterminate;
        }
      }}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0",
        disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
        className
      )}
      aria-label={
        indeterminate
          ? "Select some items"
          : checked
            ? "Deselect item"
            : "Select item"
      }
    />
  );
}

// Loading skeleton for table rows
function TableSkeleton({
  columns,
  rows = 5,
}: {
  columns: TableColumn[];
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {columns.map((column, colIndex) => (
            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Empty state component
function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}: TableProps["pagination"]) {
  if (!totalPages || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>

        {showPageSizeSelector && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                ...
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  page === currentPage
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                )}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Main Table Component
export function Table<T = any>({
  columns,
  rows,
  loading = false,
  selectable = false,
  multiSelect = true,
  selectedRows = [],
  onSelectionChange,
  defaultSort,
  onSort,
  pagination,
  size = "md",
  variant = "default",
  stickyHeader = false,
  stickyFirstColumn = false,
  actions,
  emptyState,
  className,
  rowClassName,
  onRowClick,
}: TableProps<T>) {
  const [internalSortKey, setInternalSortKey] = useState<string | null>(
    defaultSort?.key || null
  );
  const [internalSortDirection, setInternalSortDirection] =
    useState<SortDirection>(defaultSort?.direction || null);
  const [internalSelectedRows, setInternalSelectedRows] =
    useState<(string | number)[]>(selectedRows);

  // Use external state if provided
  const sortKey = onSort ? defaultSort?.key || null : internalSortKey;
  const sortDirection = onSort
    ? defaultSort?.direction || null
    : internalSortDirection;
  const currentSelectedRows = onSelectionChange
    ? selectedRows
    : internalSelectedRows;

  // Handle sorting
  const handleSort = useCallback(
    (key: string) => {
      let newDirection: SortDirection = "asc";

      if (sortKey === key) {
        newDirection =
          sortDirection === "asc"
            ? "desc"
            : sortDirection === "desc"
              ? null
              : "asc";
      }

      if (onSort) {
        onSort(key, newDirection as "asc" | "desc");
      } else {
        setInternalSortKey(newDirection ? key : null);
        setInternalSortDirection(newDirection);
      }
    },
    [sortKey, sortDirection, onSort]
  );

  // Handle row selection
  const handleRowSelect = useCallback(
    (rowId: string | number, selected: boolean) => {
      let newSelectedRows: (string | number)[];

      if (multiSelect) {
        if (selected) {
          newSelectedRows = [...currentSelectedRows, rowId];
        } else {
          newSelectedRows = currentSelectedRows.filter((id) => id !== rowId);
        }
      } else {
        newSelectedRows = selected ? [rowId] : [];
      }

      if (onSelectionChange) {
        onSelectionChange(newSelectedRows);
      } else {
        setInternalSelectedRows(newSelectedRows);
      }
    },
    [currentSelectedRows, multiSelect, onSelectionChange]
  );

  // Handle select all
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      const selectableRows = rows.filter((row) => !row.disabled);
      const newSelectedRows = selected
        ? selectableRows.map((row) => row.id)
        : [];

      if (onSelectionChange) {
        onSelectionChange(newSelectedRows);
      } else {
        setInternalSelectedRows(newSelectedRows);
      }
    },
    [rows, onSelectionChange]
  );

  // Calculate selection state
  const selectableRows = rows.filter((row) => !row.disabled);
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((row) => currentSelectedRows.includes(row.id));
  const someSelected =
    selectableRows.some((row) => currentSelectedRows.includes(row.id)) &&
    !allSelected;

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-6 py-4 text-sm",
    lg: "px-8 py-6 text-base",
  };

  // Variant classes
  const variantClasses = {
    default: "divide-y divide-gray-200",
    bordered: "border border-gray-300 divide-y divide-gray-200",
    striped: "divide-y divide-gray-200",
    minimal: "divide-y divide-gray-100",
  };

  // Row variant classes
  const getRowVariantClasses = (index: number, isSelected: boolean) => {
    const baseClasses =
      variant === "striped" && index % 2 === 1 ? "bg-gray-50" : "";
    const selectedClasses = isSelected ? "bg-blue-50" : "";
    return cn(baseClasses, selectedClasses);
  };

  const contextValue: TableContextValue<T> = {
    columns,
    selectable,
    multiSelect,
    selectedRows: currentSelectedRows,
    sortKey,
    sortDirection,
    handleSort,
    handleRowSelect,
    handleSelectAll,
    allSelected,
    someSelected,
  };

  // Render table content
  const renderTableContent = () => {
    if (loading) {
      return <TableSkeleton columns={columns} />;
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
            className="px-6 py-12"
          >
            {emptyState ? (
              <EmptyState {...emptyState} />
            ) : (
              <EmptyState title="No data available" />
            )}
          </td>
        </tr>
      );
    }

    return rows.map((row, rowIndex) => {
      const isSelected = currentSelectedRows.includes(row.id);
      const isDisabled = row.disabled || false;

      return (
        <tr
          key={row.id}
          className={cn(
            "hover:bg-gray-50 transition-colors",
            getRowVariantClasses(rowIndex, isSelected),
            isDisabled && "opacity-50 cursor-not-allowed",
            onRowClick && !isDisabled && "cursor-pointer",
            rowClassName?.(row, rowIndex)
          )}
          onClick={() => {
            if (onRowClick && !isDisabled) {
              onRowClick(row, rowIndex);
            }
          }}
          onKeyDown={(e) => {
            if (
              onRowClick &&
              !isDisabled &&
              (e.key === "Enter" || e.key === " ")
            ) {
              e.preventDefault();
              onRowClick(row, rowIndex);
            }
          }}
          tabIndex={onRowClick && !isDisabled ? 0 : undefined}
          role={onRowClick ? "button" : undefined}
          aria-selected={isSelected}
        >
          {/* Selection column */}
          {selectable && (
            <td className={cn("whitespace-nowrap", sizeClasses[size])}>
              <SelectionCheckbox
                checked={isSelected}
                onChange={(checked) => handleRowSelect(row.id, checked)}
                disabled={isDisabled}
              />
            </td>
          )}

          {/* Data columns */}
          {columns.map((column) => {
            const value =
              column.key === "id" ? row.id : (row.data as any)[column.key];
            const renderedValue = column.render
              ? column.render(value, row.data, rowIndex)
              : value;

            return (
              <td
                key={column.key as string}
                className={cn(
                  "whitespace-nowrap",
                  sizeClasses[size],
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.className,
                  stickyFirstColumn &&
                    columns.indexOf(column) === 0 &&
                    "sticky left-0 bg-white z-10"
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {renderedValue}
              </td>
            );
          })}

          {/* Actions column */}
          {actions && actions.length > 0 && (
            <td className={cn("whitespace-nowrap", sizeClasses[size])}>
              <div className="flex items-center space-x-2">
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    disabled={action.disabled || isDisabled}
                    className={cn(
                      "inline-flex items-center px-2 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[32px]",
                      action.variant === "primary" &&
                        "text-blue-700 bg-blue-100 hover:bg-blue-200",
                      action.variant === "secondary" &&
                        "text-gray-700 bg-gray-100 hover:bg-gray-200",
                      action.variant === "danger" &&
                        "text-red-700 bg-red-100 hover:bg-red-200",
                      (action.disabled || isDisabled) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={`${action.label} for ${row.id}`}
                  >
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <TableContext.Provider value={contextValue}>
      <div className={cn("bg-white", className)}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={cn("bg-gray-50", stickyHeader && "sticky top-0 z-20")}
            >
              <tr>
                {/* Selection header */}
                {selectable && (
                  <th
                    scope="col"
                    className={cn(
                      "whitespace-nowrap font-medium text-gray-900",
                      sizeClasses[size]
                    )}
                  >
                    {multiSelect && (
                      <SelectionCheckbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={handleSelectAll}
                      />
                    )}
                  </th>
                )}

                {/* Data headers */}
                {columns.map((column) => (
                  <th
                    key={column.key as string}
                    scope="col"
                    className={cn(
                      "whitespace-nowrap font-medium text-gray-900",
                      sizeClasses[size],
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.className,
                      stickyFirstColumn &&
                        columns.indexOf(column) === 0 &&
                        "sticky left-0 bg-gray-50 z-10"
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    <SortButton column={column}>{column.header}</SortButton>
                  </th>
                ))}

                {/* Actions header */}
                {actions && actions.length > 0 && (
                  <th
                    scope="col"
                    className={cn(
                      "whitespace-nowrap font-medium text-gray-900",
                      sizeClasses[size]
                    )}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={cn("bg-white", variantClasses[variant])}>
              {renderTableContent()}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && <Pagination {...pagination} />}
      </div>
    </TableContext.Provider>
  );
}

// Export utility hooks
export function useTableSelection() {
  const {
    selectedRows,
    handleRowSelect,
    handleSelectAll,
    allSelected,
    someSelected,
  } = useTableContext();
  return {
    selectedRows,
    handleRowSelect,
    handleSelectAll,
    allSelected,
    someSelected,
  };
}

export function useTableSort() {
  const { sortKey, sortDirection, handleSort } = useTableContext();
  return {
    sortKey,
    sortDirection,
    handleSort,
  };
}
