import { api } from "../../../services/api/clients";
import type {
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
