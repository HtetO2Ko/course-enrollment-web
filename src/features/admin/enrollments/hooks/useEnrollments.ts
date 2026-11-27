import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  approveEnrollment,
  getPendingEnrollments,
} from "../services/enrollment.service";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  pendingLists: () => [...enrollmentKeys.all, "pending"] as const,
  pendingList: (page: number, perPage: number) =>
    [...enrollmentKeys.pendingLists(), { page, perPage }] as const,
};

export function usePendingEnrollments(page: number, perPage = 10) {
  return useQuery({
    queryKey: enrollmentKeys.pendingList(page, perPage),
    queryFn: () => getPendingEnrollments({ page, perPage }),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}

export function useApproveEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentid: string) => approveEnrollment(enrollmentid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.pendingLists(),
      });
    },
  });
}
