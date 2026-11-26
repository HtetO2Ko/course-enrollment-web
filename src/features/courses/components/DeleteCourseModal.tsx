import { AlertTriangle, X } from "lucide-react";
import type { Course } from "../types/course.types";

interface DeleteCourseModalProps {
  course: Course | null;
  isDeleting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: (courseid: string) => void;
}

export default function DeleteCourseModal({
  course,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteCourseModalProps) {
  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-maincolor/40 p-4 backdrop-blur-xs"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-card-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-maincolor">
                Delete Course
              </h2>
              <p className="text-xs text-unselected-color">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete modal"
            className="cursor-pointer rounded-lg p-1.5 text-unselected-color transition hover:bg-maincolor/5 hover:text-maincolor disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm text-unselected-color">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-maincolor">{course.title}</span>?
        </p>

        {errorMessage && (
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl border border-card-border px-4 py-2.5 text-sm font-medium text-maincolor transition hover:bg-maincolor/5 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(course.courseid)}
            className="cursor-pointer rounded-xl bg-delete-button-color px-4 py-2.5 text-sm font-semibold text-delete-button-txt transition hover:bg-delete-button-hover disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
