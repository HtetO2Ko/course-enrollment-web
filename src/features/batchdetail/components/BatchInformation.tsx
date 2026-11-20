import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Batch, BatchStatus } from "../../batches/types/batch.types";
import {
  formatDate,
  formatDays,
  formatText,
  formatTime,
} from "../../../utils/formatters";
import InfoItem from "./InfoItem";
import { useAuth } from "../../../context/AuthContext";
import { useMyEnrollments } from "../../enrollments/hooks/useMyEnrollments";
import { useCreateEnrollment } from "../../enrollments/hooks/useCreateEnrollment";
import { useNavigate } from "react-router";

interface BatchInformationProps {
  batch: Batch;
  status: BatchStatus;
}

function getLevelStyle(level: string): string {
  switch (level) {
    case "BEGINNER":
      return "bg-lvl-bgr-bg-color text-lvl-bgr-txt-color";
    case "INTERMEDIATE":
      return "bg-lvl-itm-bg-color text-lvl-itm-txt-color";
    case "ADVANCED":
      return "bg-lvl-adv-bg-color text-lvl-adv-txt-color";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function BatchInformation({
  batch,
  status,
}: BatchInformationProps) {
  const { t } = useTranslation();
  const { course } = batch;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: enrollments, isPending: isCheckingEnrollment } =
    useMyEnrollments(isAuthenticated);

  const createEnrollmentMutation = useCreateEnrollment();

  const enrollment = enrollments?.find(
    (item) => item.batchid === batch.batchid,
  );

  const isWaiting = status === "ongoing";

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      const enrollmentPath = `/batches/${batch.batchid}/enroll?isWaiting=${isWaiting}`;
      navigate(`/login?redirect=${encodeURIComponent(enrollmentPath)}`);
      return;
    }

    if (!batch.batchid || enrollment || createEnrollmentMutation.isPending) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const result = await createEnrollmentMutation.mutateAsync({
        batchid: batch.batchid,
        isWaiting,
      });

      setSuccess(
        result.isWaiting
          ? "You have been added to the waiting list."
          : "Enrollment successful!",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed.");
    }
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <article className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-maincolor">
          Batch Information
        </h2>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t("level")}
            </p>

            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getLevelStyle(course.level)}`}
            >
              {formatText(course.level)}
            </span>
          </div>

          <InfoItem label={t("duration")} value={`${course.duration} months`} />

          <InfoItem
            label={t("time")}
            value={`${formatDays(batch.classDays)} at ${formatTime(batch.classTime)}`}
          />

          <InfoItem
            label={t("start-date")}
            value={formatDate(batch.startDate)}
          />

          <InfoItem
            label={t("fees")}
            value={`${course.fees.toLocaleString("en-US")} MMK / month`}
          />
        </div>

        <div className="mt-8">
          {enrollment ? (
            <div
              className={`rounded-xl px-5 py-3 text-center font-semibold ${
                enrollment.isWaiting
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {enrollment.isWaiting
                ? "You are on the waiting list"
                : "You are already enrolled"}
            </div>
          ) : isAuthenticated && isCheckingEnrollment ? (
            <div className="rounded-xl bg-gray-100 px-5 py-3 text-center text-sm text-gray-500">
              Checking enrollment...
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnrollment}
              disabled={createEnrollmentMutation.isPending}
              className={`w-full rounded-xl px-5 py-3 text-center font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                status === "upcoming"
                  ? "bg-button-color text-button-txt"
                  : "border border-button-color bg-button-color/10 text-button-color"
              }`}
            >
              {createEnrollmentMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting...
                </span>
              ) : status === "upcoming" ? (
                "Enroll Now"
              ) : (
                "Wait for Another Batch"
              )}
            </button>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="mt-3 text-sm text-green-600">
              {success}
            </p>
          )}
        </div>
      </article>
    </aside>
  );
}
