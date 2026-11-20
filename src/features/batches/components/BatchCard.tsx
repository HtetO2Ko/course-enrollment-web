import { Link, useLocation } from "react-router";
import type { Batch, BatchStatus } from "../types/batch.types";
import {
  formatText,
  formatDays,
  formatTime,
  formatDate,
} from "../../../utils/formatters";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { useMyEnrollments } from "../../enrollments/hooks/useMyEnrollments";

interface BatchCardProps {
  batch: Batch;
  status: BatchStatus;
}

function getLevel(level: string) {
  switch (level) {
    case "BEGINNER":
      return (
        <span className="rounded-full bg-lvl-bgr-bg-color px-3 py-1 text-xs font-semibold text-lvl-bgr-txt-color">
          {formatText(level)}
        </span>
      );

    case "INTERMEDIATE":
      return (
        <span className="rounded-full bg-lvl-itm-bg-color px-3 py-1 text-xs font-semibold text-lvl-itm-txt-color">
          {formatText(level)}
        </span>
      );

    case "ADVANCED":
      return (
        <span className="rounded-full bg-lvl-adv-bg-color px-3 py-1 text-xs font-semibold text-lvl-adv-txt-color">
          {formatText(level)}
        </span>
      );

    default:
      return null;
  }
}

export default function BatchCard({ batch, status }: BatchCardProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const { data: enrollments } = useMyEnrollments(isAuthenticated);

  const enrollment = enrollments?.find(
    (item) => item.batchid === batch.batchid,
  );

  const { course, batchCode, startDate, classDays, classTime } = batch;

  return (
    <Link
      to={`/batches/${batch.batchid}?status=${status}`}
      state={{
        backgroundLocation: location,
        scrollY: window.scrollY,
      }}
      className="block"
    >
      <article className="overflow-hidden rounded-2xl border border-card-border bg-card font-roboto shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative">
          <img
            src={course.imageURL}
            alt={course.title}
            className="h-48 w-full object-cover"
          />

          {enrollment && (
            <span
              className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow ${
                enrollment.isWaiting
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {enrollment.isWaiting ? "Waiting List" : "Enrolled"}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 pb-3">
            <div>
              <h3 className="text-lg font-semibold text-maincolor">
                {course.title}
              </h3>

              <p className="text-sm font-light text-maincolor">
                Batch: {batchCode}
              </p>
            </div>

            {getLevel(course.level)}
          </div>

          <div className="space-y-1.25 text-sm text-maincolor">
            <p>
              {t("duration")} - {course.duration} months
            </p>

            <p>
              {t("time")} - {formatDays(classDays)} at {formatTime(classTime)}
            </p>

            <p>
              {t("start-date")} - {formatDate(startDate)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
