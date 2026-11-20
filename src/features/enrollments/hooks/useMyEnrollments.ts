import { useQuery } from "@tanstack/react-query";
import { getMyEnrollments } from "../services/enrollment.service";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  mine: () => [...enrollmentKeys.all, "mine"] as const,
};

export function useMyEnrollments(enabled = true) {
  return useQuery({
    queryKey: enrollmentKeys.mine(),
    queryFn: getMyEnrollments,
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
