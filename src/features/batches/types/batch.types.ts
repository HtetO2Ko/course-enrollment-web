export interface Course {
  courseid: string;
  title: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  fees: number;
  duration: number;
  imageURL: string;
}

export interface Batch {
  batchid: string;
  batchCode: string;
  capacity: number;
  startDate: string;
  classDays: string[];
  classTime: string;
  courseId: string;
  course: Course;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export interface PaginationMeta {
  total: number;
  newPage: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedBatches {
  data: Batch[];
  meta: PaginationMeta;
}
