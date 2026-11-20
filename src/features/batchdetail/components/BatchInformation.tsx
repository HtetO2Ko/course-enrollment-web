import { Link } from "react-router";
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

  const enrollmentPath = `/batches/${batch.batchid}/enroll`;
  const loginPath = `/login?redirect=${encodeURIComponent(enrollmentPath)}`;

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
          {status === "upcoming" ? (
            <Link
              to={isAuthenticated ? enrollmentPath : loginPath}
              className="block w-full rounded-xl bg-button-color px-5 py-3 text-center font-semibold text-button-txt transition-opacity hover:opacity-90"
            >
              Enroll Now
            </Link>
          ) : (
            <Link
              to="/#upcoming-batches"
              className="block w-full rounded-xl bg-secondary-button-color px-5 py-3 text-center font-semibold text-secondary-button-txt transition-opacity hover:opacity-90"
            >
              Wait for Another Batch
            </Link>
          )}
        </div>
      </article>
    </aside>
  );
}
