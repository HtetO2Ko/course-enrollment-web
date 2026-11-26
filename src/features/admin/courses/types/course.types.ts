export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Course {
  courseid: string;
  title: string;
  level: CourseLevel;
  description: string;
  fees: number;
  duration: number;
  outlines: string;
  prerequisite: string;
  createdBy: string;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseMutationPayload {
  imageURL: string;
  title: string;
  level: CourseLevel;
  description: string;
  fees: number;
  duration: number;
  outlines: string;
  prerequisite: string;
}

export interface CoursePagination {
  total: number;
  newPage: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetCoursesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetCoursesResponse {
  data: Course[];
  meta: CoursePagination;
}
