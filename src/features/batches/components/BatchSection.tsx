import { useTranslation } from "react-i18next";
import type { Batch } from "../types/batch.types";
import BatchCard from "./BatchCard";
import BatchSkeleton from "./BatchSkeleton";

interface BatchSectionProps {
  title: string;
  batches?: Batch[];
  isLoading: boolean;
  isError: boolean;
}

export default function BatchSection({
  title,
  batches,
  isLoading,
  isError,
}: BatchSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="py-8">
      <h2 className="font-sans mb-6 text-xl font-bold text-maincolor">
        {t(title)}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <BatchSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load {title.toLowerCase()}.</p>
      ) : !batches?.length ? (
        <p className="text-unselected-color">No batches available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <BatchCard key={batch.batchid} batch={batch} />
          ))}
        </div>
      )}
    </section>
  );
}
