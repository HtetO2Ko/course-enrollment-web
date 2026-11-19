import type {
  ApiResponse,
  Batch,
  PaginatedBatches,
} from "../features/batches/types/batch.types";
import { publicApi } from "./api/clients";

export const getUpcomingBatches = async (): Promise<Batch[]> => {
  const { data } = await publicApi.get<ApiResponse<Batch[]>>(
    "/batch/getBatchesForUser",
    {
      params: { status: "upcoming" },
    },
  );

  return data.data;
};

export const getOngoingBatches = async (): Promise<Batch[]> => {
  const { data } = await publicApi.get<ApiResponse<PaginatedBatches>>(
    "/batch/getBatchesForUser",
    {
      params: { status: "ongoing" },
    },
  );

  return data.data.data;
};

export const getBatchById = async (id: string): Promise<Batch> => {
  const { data } = await publicApi.get<ApiResponse<Batch>>(
    "/batch/getBatchByID",
    {
      params: { id },
    },
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
