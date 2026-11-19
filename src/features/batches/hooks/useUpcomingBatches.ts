import { useQuery } from "@tanstack/react-query";
import { getUpcomingBatches } from "../../../services/batch.service";

export const useUpcomingBatches = () => {
  return useQuery({
    queryKey: ["batches", "upcoming"],
    queryFn: getUpcomingBatches,
  });
};
