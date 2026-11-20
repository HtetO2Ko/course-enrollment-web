import { useQuery } from "@tanstack/react-query";
import { getOngoingBatches } from "../services/batch.service";
import type { Batch } from "../types/batch.types";

export function useOngoingBatches() {
  return useQuery<Batch[], Error>({
    queryKey: ["batches", "ongoing"],
    queryFn: getOngoingBatches,
  });
}
