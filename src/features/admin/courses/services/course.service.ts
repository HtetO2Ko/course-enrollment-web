
import { api } from "../../../../services/api/clients";
import type {
  Course,
  CourseMutationPayload,
  GetCoursesParams,
  GetCoursesResponse,
} from "../types/course.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export const getCourses = async ({
  search = "",
  page = 1,
  limit = 10,
}: GetCoursesParams = {}): Promise<GetCoursesResponse> => {
  const { data } = await api.get<ApiResponse<GetCoursesResponse>>(
    "/course/getall",
    {
      params: {
        search,
        page,
        limit,
      },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch courses");
  }

  return data.data;
};

export const createCourse = async (
  payload: CourseMutationPayload,
): Promise<Course> => {
  const { data } = await api.post<ApiResponse<Course>>(
    "/course/create",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to create course");
  }

  return data.data;
};

export const updateCourse = async (
  courseid: string,
  payload: CourseMutationPayload,
): Promise<Course> => {
  const { data } = await api.patch<ApiResponse<Course>>(
    "/course/update",
    payload,
    {
      params: { courseid },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update course");
  }

  return data.data;
};

export const deleteCourse = async (courseid: string): Promise<Course> => {
  const { data } = await api.delete<ApiResponse<Course>>("/course/delete", {
    params: { courseid },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to delete course");
  }

  return data.data;
};
