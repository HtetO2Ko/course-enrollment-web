import { useQuery } from "@tanstack/react-query";
import { getBatchById } from "../../../services/batch.service";

export const useBatchDetail = (batchId: string) => {
  return useQuery({
    queryKey: ["batches", "detail", batchId],
    queryFn: () => getBatchById(batchId),
    enabled: Boolean(batchId),
  });
};
