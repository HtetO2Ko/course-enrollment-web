import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  itemLabel?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    limitOptions?: number[];
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  isFetching = false,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display.",
  itemLabel = "items",
  pagination,
}: DataTableProps<T>) {
  const limitOptions = pagination?.limitOptions ?? [5, 10, 20, 50];

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left">
          <thead>
            <tr className="border-b border-maincolor/10">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-xs font-semibold tracking-wide text-unselected-color ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-maincolor/5">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 w-full max-w-32 animate-pulse rounded bg-maincolor/10" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <p className="font-semibold text-maincolor">{emptyTitle}</p>
                  <p className="mt-1 text-sm text-unselected-color">
                    {emptyDescription}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-maincolor/5 transition-colors last:border-b-0 hover:bg-maincolor/2.5 ${
                    isFetching ? "opacity-70" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 align-middle text-sm ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, unknown>)[
                            column.key
                          ] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col gap-3 border-t border-maincolor/10 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Total count & page indicator */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-unselected-color">
            <span>
              Total{" "}
              <span className="font-semibold text-maincolor">
                {pagination.totalItems}
              </span>{" "}
              {itemLabel}
            </span>
            <span>·</span>
            <span>
              Page{" "}
              <span className="font-medium text-maincolor">
                {pagination.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-maincolor">
                {Math.max(1, pagination.totalPages)}
              </span>
            </span>
          </div>

          {/* Rows per page selector + Prev/Next */}
          <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
            {pagination.onLimitChange && (
              <label className="flex items-center gap-2 text-sm text-unselected-color">
                <span>Rows:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) =>
                    pagination.onLimitChange?.(Number(e.target.value))
                  }
                  className="cursor-pointer rounded-lg border border-card-border bg-admin-surface px-2.5 py-1.5 text-sm font-medium text-maincolor outline-none transition focus:ring-2 focus:ring-button-color/30"
                >
                  {limitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pagination.currentPage <= 1 || isFetching}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-sm font-medium text-maincolor transition hover:bg-maincolor/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  pagination.currentPage >=
                    Math.max(1, pagination.totalPages) || isFetching
                }
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-sm font-medium text-maincolor transition hover:bg-maincolor/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
