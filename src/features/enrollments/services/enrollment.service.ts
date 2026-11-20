import { api } from "../../../services/api/clients";
import type {
  ApiResponse,
  CreateEnrollmentPayload,
  MyEnrollment,
  Enrollment,
} from "../types/enrollment.types";

export const createEnrollment = async (
  payload: CreateEnrollmentPayload,
): Promise<Enrollment> => {
  const response = await api.post<ApiResponse<Enrollment>>(
    "/enrollment/create",
    payload,
  );

  return response.data.data;
};

export const getMyEnrollments = async (): Promise<MyEnrollment[]> => {
  const response = await api.get<ApiResponse<MyEnrollment[]>>(
    "/enrollment/my-enrollments",
  );

  return response.data.data;
};
