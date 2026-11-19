import BatchSection from "../../features/batches/components/BatchSection";
import { useOngoingBatches } from "../../features/batches/hooks/useOngoingBatches";
import { useUpcomingBatches } from "../../features/batches/hooks/useUpcomingBatches";

export default function Home() {
  const upcoming = useUpcomingBatches();
  const ongoing = useOngoingBatches();

  return (
    <div>
      <BatchSection
        title="upcoming-batches"
        batches={upcoming.data}
        status="upcoming"
        isLoading={upcoming.isPending}
        isError={upcoming.isError}
      />

      <BatchSection
        title="ongoing-batches"
        batches={ongoing.data}
        status="ongoing"
        isLoading={ongoing.isPending}
        isError={ongoing.isError}
      />
    </div>
  );
}
