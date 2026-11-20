import { api } from "../../../services/api/clients";
import type {
  MyEnrollment,
  UpdateProfilePayload,
  UserProfile,
} from "../types/account.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: unknown;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<ApiResponse<UserProfile>>("/user/me");

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch profile.");
  }

  return data.data;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const { data } = await api.patch<ApiResponse<UserProfile>>(
    "/user/me",
    payload,
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to update profile.");
  }

  return data.data;
};

export const getMyEnrollments = async (): Promise<MyEnrollment[]> => {
  const { data } = await api.get<ApiResponse<MyEnrollment[]>>(
    "/enrollment/my-enrollments",
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch enrollments.");
  }

  return data.data;
};

export const removeMyEnrollment = async (
  enrollmentid: string,
): Promise<void> => {
  const { data } = await api.delete<ApiResponse<unknown>>(
    `/enrollment/${enrollmentid}`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to cancel enrollment.");
  }
};
