import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollment } from "../services/enrollment.service";
import { enrollmentKeys } from "./useMyEnrollments";

export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEnrollment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.mine(),
      });

      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
    },
  });
}
