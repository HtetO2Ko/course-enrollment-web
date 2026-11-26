import { Pencil, Trash2 } from "lucide-react";
import type { Course } from "../types/course.types";
import type { DataTableColumn } from "../../../../components/common/DataTable";
import DataTable from "../../../../components/common/DataTable";

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  isFetching?: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const levelStyles: Record<Course["level"], string> = {
  BEGINNER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  INTERMEDIATE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ADVANCED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

const columns: DataTableColumn<Course>[] = [
  {
    key: "course",
    header: "Course",
    className: "min-w-80",
    render: (course) => (
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={course.imageURL}
          alt={course.title}
          className="h-12 w-16 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="truncate font-semibold text-maincolor">
            {course.title}
          </p>

          <p className="mt-1 line-clamp-1 max-w-100 text-xs leading-5 text-unselected-color">
            {course.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "level",
    header: "Level",
    className: "whitespace-nowrap",
    render: (course) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${levelStyles[course.level]}`}
      >
        {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
      </span>
    ),
  },
  {
    key: "fees",
    header: "Fees",
    className: "whitespace-nowrap",
    render: (course) => (
      <div>
        <p className="font-medium text-maincolor">
          {course.fees.toLocaleString()}
        </p>
        <p className="text-xs text-unselected-color">MMK</p>
      </div>
    ),
  },
  {
    key: "duration",
    header: "Duration",
    className: "whitespace-nowrap",
    render: (course) => (
      <span className="text-maincolor">{course.duration} months</span>
    ),
  },
];

export default function CourseTable({
  courses,
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
}: CourseTableProps) {
  const actionColumn: DataTableColumn<Course> = {
    key: "actions",
    header: "",
    className: "w-24 text-right",
    render: (course) => (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(course)}
          title="Edit course"
          className="cursor-pointer rounded-lg p-2 text-unselected-color transition hover:bg-blue-500/10 hover:text-blue-500"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(course)}
          title="Delete course"
          className="cursor-pointer rounded-lg p-2 text-unselected-color transition hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  };

  return (
    <DataTable
      columns={[...columns, actionColumn]}
      data={courses}
      rowKey={(course) => course.courseid}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyTitle="No courses found"
      emptyDescription="Try another search or create your first course."
      itemLabel="courses"
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
