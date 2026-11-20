import { publicApi } from "../../../services/api/clients";
import type { Batch } from "../types/batch.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: unknown;
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    newPage: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getUpcomingBatches = async (): Promise<Batch[]> => {
  const { data } = await publicApi.get<ApiResponse<Batch[]>>(
    "/batch/getBatchesForUser",
    {
      params: { status: "upcoming" },
    },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch upcoming batches");
  }

  return data.data;
};

export const getOngoingBatches = async (): Promise<Batch[]> => {
  const { data } = await publicApi.get<ApiResponse<PaginatedResult<Batch>>>(
    "/batch/getBatchesForUser",
    {
      params: { status: "ongoing" },
    },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch ongoing batches");
  }

  return data.data.data;
};

export const getBatchById = async (id: string): Promise<Batch> => {
  const { data } = await publicApi.get<ApiResponse<Batch>>(
    "/batch/getBatchByID",
    {
      params: { id },
    },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch batch");
  }

  return data.data;
};
