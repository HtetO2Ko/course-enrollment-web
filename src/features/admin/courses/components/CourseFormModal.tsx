import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Course,
  CourseLevel,
  CourseMutationPayload,
} from "../types/course.types";

interface CourseFormModalProps {
  isOpen: boolean;
  course: Course | null;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: CourseMutationPayload) => void;
}

const INITIAL_FORM: CourseMutationPayload = {
  imageURL: "",
  title: "",
  level: "BEGINNER",
  description: "",
  fees: 0,
  duration: 1,
  outlines: "",
  prerequisite: "",
};

export default function CourseFormModal({
  isOpen,
  course,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CourseFormModalProps) {
  const [form, setForm] = useState<CourseMutationPayload>(INITIAL_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValidationError(null);

    if (course) {
      setForm({
        imageURL: course.imageURL,
        title: course.title,
        level: course.level,
        description: course.description,
        fees: course.fees,
        duration: course.duration,
        outlines: course.outlines,
        prerequisite: course.prerequisite,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, course]);

  if (!isOpen) return null;

  const isEdit = Boolean(course);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setValidationError("Course title is required.");
      return;
    }

    if (!form.imageURL.trim()) {
      setValidationError("Image URL is required.");
      return;
    }

    if (Number.isNaN(form.fees) || form.fees < 0) {
      setValidationError("Fees must be 0 or greater.");
      return;
    }

    if (Number.isNaN(form.duration) || form.duration < 1) {
      setValidationError("Duration must be at least 1 month.");
      return;
    }

    setValidationError(null);

    onSubmit({
      imageURL: form.imageURL.trim(),
      title: form.title.trim(),
      level: form.level,
      description: form.description.trim(),
      fees: Number(form.fees),
      duration: Number(form.duration),
      outlines: form.outlines.trim(),
      prerequisite: form.prerequisite.trim(),
    });
  };

  const displayError = validationError || errorMessage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-maincolor/40 p-4 backdrop-blur-xs"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-card-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-maincolor">
              {isEdit ? "Edit Course" : "Create Course"}
            </h2>
            <p className="mt-0.5 text-xs text-unselected-color">
              {isEdit
                ? "Update course details, pricing, and curriculum."
                : "Add a new course to your catalog."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg p-1.5 text-unselected-color transition hover:bg-maincolor/5 hover:text-maincolor disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {displayError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {displayError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Agentic Software Developer"
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Level */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Level
              </label>
              <select
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: e.target.value as CourseLevel })
                }
                className="w-full cursor-pointer rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Image URL
              </label>
              <input
                type="url"
                required
                value={form.imageURL}
                onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
                placeholder="https://.../course.png"
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Fees */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Fees (MMK)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                required
                value={form.fees}
                onChange={(e) =>
                  setForm({ ...form, fees: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Duration (Months)
              </label>
              <input
                type="number"
                min={1}
                step={1}
                required
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Course overview and key outcomes..."
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Outlines */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Outlines (one topic per line)
              </label>
              <textarea
                rows={5}
                value={form.outlines}
                onChange={(e) => setForm({ ...form, outlines: e.target.value })}
                placeholder="Introduction to Web Development..."
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Prerequisite */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Prerequisite (one item per line)
              </label>
              <textarea
                rows={3}
                value={form.prerequisite}
                onChange={(e) =>
                  setForm({ ...form, prerequisite: e.target.value })
                }
                placeholder="Basic computer skills..."
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-card-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-card-border px-4 py-2.5 text-sm font-medium text-maincolor transition hover:bg-maincolor/5 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-button-color px-4 py-2.5 text-sm font-semibold text-button-txt transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
