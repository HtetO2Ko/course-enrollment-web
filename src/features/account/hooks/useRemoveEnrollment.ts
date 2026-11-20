import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMyEnrollment } from "../services/account.service";
import { enrollmentKeys } from "../../enrollments/hooks/useMyEnrollments";

export function useRemoveEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => removeMyEnrollment(enrollmentId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: enrollmentKeys.mine(),
        }),
        queryClient.invalidateQueries({
          queryKey: ["batches"],
        }),
      ]);
    },
  });
}
