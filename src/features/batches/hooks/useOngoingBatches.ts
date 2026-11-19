import { useQuery } from "@tanstack/react-query";
import { getOngoingBatches } from "../../../services/batch.service";

export const useOngoingBatches = () => {
  return useQuery({
    queryKey: ["batches", "ongoing"],
    queryFn: getOngoingBatches,
  });
};
