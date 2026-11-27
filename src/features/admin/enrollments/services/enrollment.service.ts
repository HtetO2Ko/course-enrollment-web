import { api } from "../../../../services/api/clients";
import type {
  GetPendingEnrollmentsParams,
  GetPendingEnrollmentsResponse,
  PendingEnrollment,
} from "../types/enrollment.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export const getPendingEnrollments = async ({
  page = 1,
  perPage = 10,
}: GetPendingEnrollmentsParams = {}): Promise<GetPendingEnrollmentsResponse> => {
  const { data } = await api.get<ApiResponse<GetPendingEnrollmentsResponse>>(
    "/enrollment/admin/pending",
    {
      params: {
        page,
        perPage,
      },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch pending enrollments");
  }

  return data.data;
};

export const approveEnrollment = async (
  enrollmentid: string,
): Promise<PendingEnrollment> => {
  const { data } = await api.patch<ApiResponse<PendingEnrollment>>(
    `/enrollment/${enrollmentid}/approve`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to approve enrollment");
  }

  return data.data;
};
