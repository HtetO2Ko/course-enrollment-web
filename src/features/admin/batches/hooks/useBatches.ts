import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createBatch,
  deleteBatch,
  getBatches,
  updateBatch,
} from "../services/batch.service";
import type { BatchMutationPayload } from "../types/batch.types";

export const batchKeys = {
  all: ["batches"] as const,
  lists: () => [...batchKeys.all, "list"] as const,
  list: (search: string, courseid: string, page: number, limit: number) =>
    [...batchKeys.lists(), { search, courseid, page, limit }] as const,
};

export function useBatches(
  search: string,
  courseid: string,
  page: number,
  limit = 10,
) {
  return useQuery({
    queryKey: batchKeys.list(search, courseid, page, limit),
    queryFn: () => getBatches({ search, courseid, page, limit }),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchMutationPayload) => createBatch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchid,
      payload,
    }: {
      batchid: string;
      payload: BatchMutationPayload;
    }) => updateBatch(batchid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchid: string) => deleteBatch(batchid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
}
