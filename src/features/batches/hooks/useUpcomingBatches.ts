import { useQuery } from "@tanstack/react-query";
import { getUpcomingBatches } from "../services/batch.service";
import type { Batch } from "../types/batch.types";

export function useUpcomingBatches() {
  return useQuery<Batch[], Error>({
    queryKey: ["batches", "upcoming"],
    queryFn: getUpcomingBatches,
  });
}
