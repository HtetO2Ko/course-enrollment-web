import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Course } from "../../courses/types/course.types";
import type {
  Batch,
  BatchMutationPayload,
  ClassDay,
} from "../types/batch.types";

interface BatchFormModalProps {
  isOpen: boolean;
  batch: Batch | null;
  courses: Course[];
  defaultCourseId?: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: BatchMutationPayload) => void;
}

const ALL_DAYS: { value: ClassDay; label: string }[] = [
  { value: "MONDAY", label: "Mon" },
  { value: "TUESDAY", label: "Tue" },
  { value: "WEDNESDAY", label: "Wed" },
  { value: "THURSDAY", label: "Thu" },
  { value: "FRIDAY", label: "Fri" },
  { value: "SATURDAY", label: "Sat" },
  { value: "SUNDAY", label: "Sun" },
];

function toDateInputValue(dateString?: string): string {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

const INITIAL_FORM: BatchMutationPayload = {
  batchCode: "",
  capacity: 10,
  startDate: "",
  classDays: [],
  classTime: "13:00",
  courseId: "",
};

export default function BatchFormModal({
  isOpen,
  batch,
  courses,
  defaultCourseId = "",
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: BatchFormModalProps) {
  const [form, setForm] = useState<BatchMutationPayload>(INITIAL_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValidationError(null);

    if (batch) {
      setForm({
        batchCode: batch.batchCode,
        capacity: batch.capacity,
        startDate: toDateInputValue(batch.startDate),
        classDays: batch.classDays,
        classTime: batch.classTime,
        courseId: batch.courseId,
      });
    } else {
      setForm({
        ...INITIAL_FORM,
        courseId: defaultCourseId || courses[0]?.courseid || "",
      });
    }
  }, [isOpen, batch, courses, defaultCourseId]);

  if (!isOpen) return null;

  const isEdit = Boolean(batch);

  const toggleDay = (day: ClassDay) => {
    setForm((prev) => {
      const exists = prev.classDays.includes(day);
      return {
        ...prev,
        classDays: exists
          ? prev.classDays.filter((d) => d !== day)
          : [...prev.classDays, day],
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.batchCode.trim()) {
      setValidationError("Batch code is required.");
      return;
    }

    if (!form.courseId.trim()) {
      setValidationError("Please select a course.");
      return;
    }

    if (!form.startDate) {
      setValidationError("Start date is required.");
      return;
    }

    if (!form.classTime.trim()) {
      setValidationError("Class time is required.");
      return;
    }

    if (form.classDays.length === 0) {
      setValidationError("Select at least one class day.");
      return;
    }

    if (Number.isNaN(form.capacity) || form.capacity < 1) {
      setValidationError("Capacity must be at least 1.");
      return;
    }

    setValidationError(null);

    onSubmit({
      batchCode: form.batchCode.trim(),
      capacity: Number(form.capacity),
      startDate: form.startDate,
      classDays: form.classDays,
      classTime: form.classTime.trim(),
      courseId: form.courseId.trim(),
    });
  };

  const displayError = validationError || errorMessage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-maincolor/40 p-4 backdrop-blur-xs"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-card-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-maincolor">
              {isEdit ? "Edit Batch" : "Create Batch"}
            </h2>
            <p className="mt-0.5 text-xs text-unselected-color">
              {isEdit
                ? "Update batch schedule, capacity, or course."
                : "Create a new class batch and schedule."}
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
            <div className="rounded-xl border border-delete-button-color/30 bg-delete-button-color/10 px-4 py-3 text-sm text-delete-button-color">
              {displayError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Batch Code */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Batch Code
              </label>
              <input
                type="text"
                required
                value={form.batchCode}
                onChange={(e) =>
                  setForm({ ...form, batchCode: e.target.value })
                }
                placeholder="e.g. PWD-O-03"
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Capacity
              </label>
              <input
                type="number"
                min={1}
                step={1}
                required
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Course */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Course
              </label>
              <select
                required
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="w-full cursor-pointer rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((course) => (
                  <option key={course.courseid} value={course.courseid}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Start Date
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Class Time */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Class Time
              </label>
              <input
                type="time"
                required
                value={form.classTime}
                onChange={(e) =>
                  setForm({ ...form, classTime: e.target.value })
                }
                className="w-full rounded-xl border border-card-border bg-admin-surface px-3.5 py-2.5 text-sm text-maincolor outline-none transition focus:border-button-color focus:ring-2 focus:ring-button-color/20"
              />
            </div>

            {/* Class Days */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-maincolor">
                Class Days
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((day) => {
                  const active = form.classDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-button-color bg-button-color text-button-txt"
                          : "border-card-border bg-admin-surface text-unselected-color hover:text-maincolor"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
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
                  : "Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
