import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import PendingEnrollmentTable from "../../features/admin/enrollments/components/PendingEnrollmentTable";
import {
  useApproveEnrollment,
  usePendingEnrollments,
} from "../../features/admin/enrollments/hooks/useEnrollments";
import type { PendingEnrollment } from "../../features/admin/enrollments/types/enrollment.types";

export default function ApproveStudentPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedBanner, setApprovedBanner] = useState<string | null>(null);

  const pendingQuery = usePendingEnrollments(page, perPage);
  const approveMutation = useApproveEnrollment();

  const enrollments = pendingQuery.data?.data ?? [];
  const meta = pendingQuery.data?.meta;

  const handleLimitChange = (newLimit: number) => {
    setPerPage(newLimit);
    setPage(1);
  };

  const handleApprove = (enrollment: PendingEnrollment) => {
    setApprovedBanner(null);
    approveMutation.reset();
    setApprovingId(enrollment.enrollmentid);

    approveMutation.mutate(enrollment.enrollmentid, {
      onSuccess: (approvedItem) => {
        const studentName = approvedItem.user?.fullname ?? "Student";
        const batchCode =
          approvedItem.batch?.batchCode ?? enrollment.batch.batchCode;
        setApprovedBanner(`Approved ${studentName} for ${batchCode}.`);
      },
      onSettled: () => {
        setApprovingId(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-maincolor sm:text-3xl">
          Approve Students
        </h1>

        <p className="mt-1 text-sm text-unselected-color">
          Review and approve pending student course enrollments.
        </p>
      </div>

      {/* Feedback Banners */}
      {approvedBanner && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{approvedBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setApprovedBanner(null)}
            className="cursor-pointer text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {approveMutation.isError && (
        <div className="flex items-center gap-2 rounded-xl border border-delete-button-color/30 bg-delete-button-color/10 px-4 py-3 text-sm text-delete-button-color">
          <AlertCircle size={18} className="shrink-0" />
          <span>
            {(approveMutation.error as Error)?.message ||
              "Failed to approve enrollment."}
          </span>
        </div>
      )}

      {/* Pending enrollments card */}
      <div className="overflow-hidden rounded-2xl border border-card-border bg-surface shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-card-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-maincolor">
              Pending Enrollments
            </h2>
            <p className="text-xs text-unselected-color">
              {pendingQuery.isFetching && !pendingQuery.isLoading
                ? "Syncing latest requests..."
                : "Approve students to confirm their seat in the batch"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => pendingQuery.refetch()}
            disabled={pendingQuery.isFetching}
            title="Refresh pending enrollments"
            aria-label="Refresh pending enrollments"
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-card-border bg-admin-surface px-3 py-2 text-xs font-medium text-unselected-color transition hover:text-maincolor disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={pendingQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error state or table */}
        {pendingQuery.isError && !pendingQuery.isLoading ? (
          <div className="m-5 rounded-xl border border-delete-button-color/30 bg-delete-button-color/10 px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-delete-button-color/15 text-delete-button-color">
              <AlertCircle size={21} />
            </div>

            <h3 className="mt-3 font-semibold text-maincolor">
              Failed to load pending enrollments
            </h3>

            <p className="mt-1 text-sm text-unselected-color">
              Something went wrong while fetching enrollment requests.
            </p>

            <button
              type="button"
              onClick={() => pendingQuery.refetch()}
              className="mt-4 cursor-pointer rounded-lg bg-button-color px-4 py-2 text-sm font-medium text-button-txt transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <PendingEnrollmentTable
            enrollments={enrollments}
            isLoading={pendingQuery.isLoading}
            isFetching={pendingQuery.isFetching}
            approvingId={approvingId}
            currentPage={meta?.currentPage ?? page}
            totalPages={meta?.totalPages ?? 1}
            totalItems={meta?.total ?? 0}
            limit={perPage}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onApprove={handleApprove}
          />
        )}
      </div>
    </div>
  );
}
