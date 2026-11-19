import { useTranslation } from "react-i18next";
import { formatDays, formatText, formatTime } from "../../../utils/formatters";
import type { Batch } from "../types/batch.types";

interface BatchCardProps {
  batch: Batch;
}

export default function BatchCard({ batch }: BatchCardProps) {
  const { course, batchCode, startDate, classDays, classTime } = batch;
  const { t } = useTranslation();

  return (
    <article className="overflow-hidden rounded-xl shadow-md font-roboto">
      <img
        src={course.imageURL}
        alt={course.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between pb-3">
          <div>
            <h3 className="text-lg font-semibold text-maincolor">
              {course.title}
            </h3>
            <p className="text-sm text-maincolor font-extralight">
              Batch: {batchCode}
            </p>
          </div>
          {getLevel(formatText(course.level))}
        </div>
        <div className="text-sm text-maincolor space-y-0.75">
          <p>
            {t("duration")} - {course.duration} months
          </p>
          <p>
            {t("time")} - {formatDays(classDays)} at {formatTime(classTime)}
          </p>
          <p>
            {t("start-date")} -{" "}
            {new Date(startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </article>
  );
}

function getLevel(level: string) {
  const baseclass =
    "h-8 flex justify-center items-center px-3 rounded-md text-sm";
  if (level.toUpperCase() === "BEGINNER") {
    return (
      <div
        className={baseclass + " bg-lvl-bgr-bg-color text-lvl-bgr-txt-color"}
      >
        {level}
      </div>
    );
  } else if (level.toUpperCase() === "INTERMEDIATE") {
    return (
      <div
        className={baseclass + " bg-lvl-itm-bg-color text-lvl-itm-txt-color"}
      >
        {level}
      </div>
    );
  } else if (level.toUpperCase() === "ADVANCED") {
    return (
      <div
        className={baseclass + " bg-lvl-adv-bg-color text-lvl-adv-txt-color"}
      >
        {level}
      </div>
    );
  }
  return (
    <div className={baseclass + " bg-lvl-bgr-bg-color text-lvl-bgr-txt-color"}>
      {level}
    </div>
  );
}
