import { api } from "../../../../services/api/clients";
import type {
  Batch,
  BatchMutationPayload,
  GetBatchesParams,
  GetBatchesResponse,
} from "../types/batch.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export const getBatches = async ({
  search = "",
  courseid = "",
  page = 1,
  limit = 10,
}: GetBatchesParams = {}): Promise<GetBatchesResponse> => {
  const params: Record<string, string | number> = {
    search,
    page,
    limit,
  };

  if (courseid) {
    params.courseid = courseid;
  }

  const { data } = await api.get<ApiResponse<GetBatchesResponse>>(
    "/batch/get",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch batches");
  }

  return data.data;
};

export const createBatch = async (
  payload: BatchMutationPayload,
): Promise<Batch> => {
  const { data } = await api.post<ApiResponse<Batch>>("/batch/create", payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to create batch");
  }

  return data.data;
};

export const updateBatch = async (
  batchid: string,
  payload: BatchMutationPayload,
): Promise<Batch> => {
  const { data } = await api.patch<ApiResponse<Batch>>(
    "/batch/update",
    payload,
    {
      params: { batchid },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update batch");
  }

  return data.data;
};

export const deleteBatch = async (batchid: string): Promise<Batch> => {
  const { data } = await api.delete<ApiResponse<Batch>>("/batch/delete", {
    params: { batchid },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to delete batch");
  }

  return data.data;
};
