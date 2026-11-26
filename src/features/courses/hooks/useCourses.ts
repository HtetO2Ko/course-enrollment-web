import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCourses } from "../services/course.service";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (search: string, page: number, limit: number) =>
    [...courseKeys.lists(), { search, page, limit }] as const,
};

export function useCourses(search: string, page: number, limit = 10) {
  return useQuery({
    queryKey: courseKeys.list(search, page, limit),
    queryFn: () => getCourses({ search, page, limit }),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}
