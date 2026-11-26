import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../services/course.service";
import type { CourseMutationPayload } from "../types/course.types";

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

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseMutationPayload) => createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseid,
      payload,
    }: {
      courseid: string;
      payload: CourseMutationPayload;
    }) => updateCourse(courseid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseid: string) => deleteCourse(courseid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
