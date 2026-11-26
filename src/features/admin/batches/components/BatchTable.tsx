import { Calendar, Clock, Pencil, Trash2, Users } from "lucide-react";

import type { Batch, ClassDay } from "../types/batch.types";
import type { DataTableColumn } from "../../../../components/common/DataTable";
import DataTable from "../../../../components/common/DataTable";

interface BatchTableProps {
  batches: Batch[];
  isLoading: boolean;
  isFetching?: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

const DAY_SHORT: Record<ClassDay, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

function formatStartDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const columns: DataTableColumn<Batch>[] = [
  {
    key: "batchCode",
    header: "Batch & Course",
    className: "min-w-64",
    render: (batch) => (
      <div className="min-w-0">
        <p className="font-semibold text-maincolor">{batch.batchCode}</p>
        <p className="mt-0.5 truncate text-xs text-unselected-color">
          {batch.course?.title ?? batch.courseId}
        </p>
      </div>
    ),
  },
  {
    key: "schedule",
    header: "Schedule",
    className: "min-w-56",
    render: (batch) => (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {batch.classDays.map((day) => (
            <span
              key={day}
              className="rounded-md bg-button-color/10 px-2 py-0.5 text-xs font-medium text-selected-color"
            >
              {DAY_SHORT[day] ?? day}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-unselected-color">
          <Clock size={13} />
          <span>{batch.classTime}</span>
        </p>
      </div>
    ),
  },
  {
    key: "startDate",
    header: "Start Date",
    className: "whitespace-nowrap",
    render: (batch) => (
      <span className="inline-flex items-center gap-1.5 text-maincolor">
        <Calendar size={14} className="text-unselected-color" />
        {formatStartDate(batch.startDate)}
      </span>
    ),
  },
  {
    key: "capacity",
    header: "Capacity",
    className: "whitespace-nowrap",
    render: (batch) => (
      <span className="inline-flex items-center gap-1.5 font-medium text-maincolor">
        <Users size={14} className="text-unselected-color" />
        {batch.capacity} students
      </span>
    ),
  },
];

export default function BatchTable({
  batches,
  isLoading,
  isFetching = false,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: BatchTableProps) {
  const actionColumn: DataTableColumn<Batch> = {
    key: "actions",
    header: "",
    className: "w-24 text-right",
    render: (batch) => (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(batch)}
          title="Edit batch"
          className="cursor-pointer rounded-lg p-2 text-unselected-color transition hover:bg-button-color/10 hover:text-selected-color"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(batch)}
          title="Delete batch"
          className="cursor-pointer rounded-lg p-2 text-unselected-color transition hover:bg-delete-button-color/10 hover:text-delete-button-color"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  };

  return (
    <DataTable
      columns={[...columns, actionColumn]}
      data={batches}
      rowKey={(batch) => batch.batchid}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyTitle="No batches found"
      emptyDescription="Try another search, course filter, or create a batch."
      itemLabel="batches"
      pagination={{
        currentPage,
        totalPages,
        totalItems,
        limit,
        limitOptions: [5, 10, 20, 50],
        onPageChange,
        onLimitChange,
      }}
    />
  );
}
