import { AlertCircle, Plus, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  Batch,
  BatchMutationPayload,
} from "../../features/admin/batches/types/batch.types";
import BatchFormModal from "../../features/admin/batches/components/BatchFormModal";
import BatchTable from "../../features/admin/batches/components/BatchTable";
import DeleteBatchModal from "../../features/admin/batches/components/DeleteBatchModal";
import {
  useBatches,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
} from "../../features/admin/batches/hooks/useBatches";
import { useCourses } from "../../features/admin/courses/hooks/useCourses";

type BatchAction = "create" | "edit" | "delete" | null;

export default function BatchesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [courseId, setCourseId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [action, setAction] = useState<BatchAction>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const coursesQuery = useCourses("", 1, 100);
  const batchesQuery = useBatches(debouncedSearch, courseId, page, limit);
  const createMutation = useCreateBatch();
  const updateMutation = useUpdateBatch();
  const deleteMutation = useDeleteBatch();

  const courses = coursesQuery.data?.data ?? [];
  const batches = batchesQuery.data?.data ?? [];
  const meta = batchesQuery.data?.meta;

  const handleCourseFilterChange = (nextCourseId: string) => {
    setCourseId(nextCourseId);
    setPage(1);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setSelectedBatch(null);
    setAction("create");
  };

  const openEdit = (batch: Batch) => {
    createMutation.reset();
    updateMutation.reset();
    setSelectedBatch(batch);
    setAction("edit");
  };

  const openDelete = (batch: Batch) => {
    deleteMutation.reset();
    setSelectedBatch(batch);
    setAction("delete");
  };

  const closeAction = () => {
    setAction(null);
    setSelectedBatch(null);
  };

  const handleFormSubmit = (payload: BatchMutationPayload) => {
    if (action === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => closeAction(),
      });
    } else if (action === "edit" && selectedBatch) {
      updateMutation.mutate(
        { batchid: selectedBatch.batchid, payload },
        {
          onSuccess: () => closeAction(),
        },
      );
    }
  };

  const handleConfirmDelete = (batchid: string) => {
    deleteMutation.mutate(batchid, {
      onSuccess: () => closeAction(),
    });
  };

  const isFormOpen = action === "create" || action === "edit";
  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;
  const formError =
    action === "create"
      ? (createMutation.error as Error | null)?.message
      : (updateMutation.error as Error | null)?.message;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-maincolor sm:text-3xl">
            Batches
          </h1>

          <p className="mt-1 text-sm text-unselected-color">
            Manage batch codes, class schedules, start dates, and seat capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-button-color px-4 py-2.5 text-sm font-semibold text-button-txt shadow-sm transition hover:opacity-90 active:scale-[0.98]"
        >
          <Plus size={18} />
          Create Batch
        </button>
      </div>

      {/* Batch catalog card */}
      <div className="overflow-hidden rounded-2xl border border-card-border bg-surface shadow-xs">
        {/* Toolbar: Course Filter, Search & Refresh */}
        <div className="flex flex-col gap-3 border-b border-card-border p-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
          <div>
            <h2 className="text-base font-semibold text-maincolor">
              Batch Schedule
            </h2>
            <p className="text-xs text-unselected-color">
              {batchesQuery.isFetching && !batchesQuery.isLoading
                ? "Syncing latest batches..."
                : "Live batches synced with server"}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Course Filter */}
            <select
              value={courseId}
              onChange={(e) => handleCourseFilterChange(e.target.value)}
              aria-label="Filter by course"
              className="w-full cursor-pointer rounded-xl border border-card-border bg-admin-surface px-3 py-2 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20 sm:w-56"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseid} value={course.courseid}>
                  {course.title}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-unselected-color"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search batch code..."
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

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => batchesQuery.refetch()}
              disabled={batchesQuery.isFetching}
              title="Refresh batches"
              aria-label="Refresh batches"
              className="cursor-pointer self-end rounded-xl border border-card-border bg-admin-surface p-2.5 text-unselected-color transition hover:text-maincolor disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={batchesQuery.isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Error state or table */}
        {batchesQuery.isError && !batchesQuery.isLoading ? (
          <div className="m-5 rounded-xl border border-delete-button-color/30 bg-delete-button-color/10 px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-delete-button-color/15 text-delete-button-color">
              <AlertCircle size={21} />
            </div>

            <h3 className="mt-3 font-semibold text-maincolor">
              Failed to load batches
            </h3>

            <p className="mt-1 text-sm text-unselected-color">
              Something went wrong while fetching batch data.
            </p>

            <button
              type="button"
              onClick={() => batchesQuery.refetch()}
              className="mt-4 cursor-pointer rounded-lg bg-button-color px-4 py-2 text-sm font-medium text-button-txt transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <BatchTable
            batches={batches}
            isLoading={batchesQuery.isLoading}
            isFetching={batchesQuery.isFetching}
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

      {/* Create / Edit Modal */}
      <BatchFormModal
        isOpen={isFormOpen}
        batch={action === "edit" ? selectedBatch : null}
        courses={courses}
        defaultCourseId={courseId}
        isSubmitting={isFormSubmitting}
        errorMessage={formError}
        onClose={closeAction}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBatchModal
        batch={action === "delete" ? selectedBatch : null}
        isDeleting={deleteMutation.isPending}
        errorMessage={(deleteMutation.error as Error | null)?.message}
        onClose={closeAction}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
