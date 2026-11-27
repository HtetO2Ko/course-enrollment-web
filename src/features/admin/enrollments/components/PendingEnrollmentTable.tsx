import { Check, Clock, User } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "../../../../components/common/DataTable";
import type { ClassDay, PendingEnrollment } from "../types/enrollment.types";

interface PendingEnrollmentTableProps {
  enrollments: PendingEnrollment[];
  isLoading: boolean;
  isFetching?: boolean;
  approvingId: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onApprove: (enrollment: PendingEnrollment) => void;
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

function formatDateTime(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const baseColumns: DataTableColumn<PendingEnrollment>[] = [
  {
    key: "student",
    header: "Student",
    className: "min-w-52",
    render: (item) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-button-color/10 text-selected-color">
          <User size={16} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-maincolor">
            {item.user?.fullname ?? "Student"}
          </p>
          <p className="truncate text-xs text-unselected-color">
            {item.user?.phone ?? item.user?.username ?? item.enrolledBy}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "courseBatch",
    header: "Course & Batch",
    className: "min-w-64",
    render: (item) => (
      <div className="flex items-center gap-3">
        {item.batch.course?.imageURL && (
          <img
            src={item.batch.course.imageURL}
            alt={item.batch.course.title}
            className="h-10 w-14 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-maincolor">
            {item.batch.course?.title ?? "Course"}
          </p>
          <p className="mt-0.5 text-xs font-medium text-selected-color">
            {item.batch.batchCode}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "schedule",
    header: "Schedule",
    className: "min-w-48",
    render: (item) => (
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {item.batch.classDays.map((day) => (
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
          <span>{item.batch.classTime}</span>
        </p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap",
    render: (item) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          item.isWaiting
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }`}
      >
        {item.isWaiting ? "Waitlisted" : "Pending Approval"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Requested At",
    className: "whitespace-nowrap",
    render: (item) => (
      <span className="text-xs text-unselected-color">
        {formatDateTime(item.createdAt)}
      </span>
    ),
  },
];

export default function PendingEnrollmentTable({
  enrollments,
  isLoading,
  isFetching = false,
  approvingId,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  onApprove,
}: PendingEnrollmentTableProps) {
  const actionColumn: DataTableColumn<PendingEnrollment> = {
    key: "actions",
    header: "",
    className: "w-32 text-right",
    render: (item) => {
      const isApprovingThis = approvingId === item.enrollmentid;
      return (
        <button
          type="button"
          disabled={Boolean(approvingId)}
          onClick={() => onApprove(item)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-button-color px-3 py-1.5 text-xs font-semibold text-button-txt transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={14} />
          {isApprovingThis ? "Approving..." : "Approve"}
        </button>
      );
    },
  };

  return (
    <DataTable
      columns={[...baseColumns, actionColumn]}
      data={enrollments}
      rowKey={(item) => item.enrollmentid}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyTitle="No pending enrollments"
      emptyDescription="All student enrollment requests have been reviewed."
      itemLabel="pending enrollments"
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
