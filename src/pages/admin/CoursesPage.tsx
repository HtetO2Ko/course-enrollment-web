import { Plus, Search, RefreshCw, AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import CourseTable from "../../features/courses/components/CourseTable";
import { useCourses } from "../../features/courses/hooks/useCourses";
import type { Course } from "../../features/courses/types/course.types";

type CourseAction = "create" | "edit" | "delete" | null;

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [action, setAction] = useState<CourseAction>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const normalized = search.trim();
      setDebouncedSearch(normalized);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const coursesQuery = useCourses(debouncedSearch, page, limit);

  const courses = coursesQuery.data?.data ?? [];
  const meta = coursesQuery.data?.meta;

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const openCreate = () => {
    setSelectedCourse(null);
    setAction("create");
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(course);
    setAction("edit");
  };

  const openDelete = (course: Course) => {
    setSelectedCourse(course);
    setAction("delete");
  };

  const closeAction = () => {
    setAction(null);
    setSelectedCourse(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-maincolor sm:text-3xl">
            Courses
          </h1>

          <p className="mt-1 text-sm text-unselected-color">
            Manage courses, curriculum, pricing, and duration.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-button-color px-4 py-2.5 text-sm font-semibold text-button-txt shadow-sm transition hover:opacity-90 active:scale-[0.98]"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* Course catalog card */}
      <div className="overflow-hidden rounded-2xl border border-card-border bg-surface shadow-xs">
        {/* Toolbar: Search & Refresh */}
        <div className="flex flex-col gap-3 border-b border-card-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-maincolor">
              Course Catalog
            </h2>
            <p className="text-xs text-unselected-color">
              {coursesQuery.isFetching && !coursesQuery.isLoading
                ? "Syncing latest courses..."
                : "Live catalog synced with server"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-unselected-color"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-xl border border-card-border bg-admin-surface py-2 pl-9 pr-8 text-sm text-maincolor outline-none transition placeholder:text-unselected-color focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-unselected-color transition hover:text-maincolor"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => coursesQuery.refetch()}
              disabled={coursesQuery.isFetching}
              title="Refresh courses"
              aria-label="Refresh courses"
              className="cursor-pointer rounded-xl border border-card-border bg-admin-surface p-2.5 text-unselected-color transition hover:text-maincolor disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={coursesQuery.isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Error state or table */}
        {coursesQuery.isError && !coursesQuery.isLoading ? (
          <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertCircle size={21} />
            </div>

            <h3 className="mt-3 font-semibold text-maincolor">
              Failed to load courses
            </h3>

            <p className="mt-1 text-sm text-unselected-color">
              Something went wrong while fetching course data.
            </p>

            <button
              type="button"
              onClick={() => coursesQuery.refetch()}
              className="mt-4 cursor-pointer rounded-lg bg-button-color px-4 py-2 text-sm font-medium text-button-txt transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <CourseTable
            courses={courses}
            isLoading={coursesQuery.isLoading}
            isFetching={coursesQuery.isFetching}
            currentPage={meta?.currentPage ?? page}
            totalPages={meta?.totalPages ?? 1}
            totalItems={meta?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Temporary dialog placeholder */}
      {action && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-maincolor/40 p-4 backdrop-blur-xs"
          onClick={closeAction}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-card-border bg-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-maincolor">
              {action === "create"
                ? "Create Course"
                : action === "edit"
                  ? "Edit Course"
                  : "Delete Course"}
            </h2>

            {selectedCourse && (
              <p className="mt-2 text-sm text-unselected-color">
                {selectedCourse.title}
              </p>
            )}

            <p className="mt-4 text-sm text-unselected-color">
              The course {action} dialog will be implemented next.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeAction}
                className="cursor-pointer rounded-xl bg-button-color px-4 py-2.5 text-sm font-semibold text-button-txt"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
