import type { Course } from "../../courses/types/course.types";

export type ClassDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Batch {
  batchid: string;
  batchCode: string;
  capacity: number;
  startDate: string;
  classDays: ClassDay[];
  classTime: string;
  courseId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
}

export interface BatchMutationPayload {
  batchCode: string;
  capacity: number;
  startDate: string; // "YYYY-MM-DD"
  classDays: ClassDay[];
  classTime: string; // "HH:mm"
  courseId: string;
}

export interface BatchPagination {
  total: number;
  newPage: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetBatchesParams {
  search?: string;
  courseid?: string;
  page?: number;
  limit?: number;
}

export interface GetBatchesResponse {
  data: Batch[];
  meta: BatchPagination;
}
