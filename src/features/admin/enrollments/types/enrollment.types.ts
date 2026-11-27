export type ClassDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface EnrollmentUser {
  userid: string;
  username: string;
  phone: string;
  fullname: string;
  role: string;
}

export interface EnrollmentCourseSummary {
  courseid: string;
  title: string;
  imageURL: string;
  level: CourseLevel;
  fees: number;
  duration: number;
}

export interface EnrollmentBatchSummary {
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
  course?: EnrollmentCourseSummary;
}

export interface PendingEnrollment {
  enrollmentid: string;
  isWaiting: boolean;
  approved: boolean;
  batchid: string;
  enrolledBy: string;
  createdAt: string;
  updatedAt: string;
  user?: EnrollmentUser;
  batch: EnrollmentBatchSummary;
}

export interface EnrollmentPagination {
  total: number;
  newPage: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetPendingEnrollmentsParams {
  page?: number;
  perPage?: number;
}

export interface GetPendingEnrollmentsResponse {
  data: PendingEnrollment[];
  meta: EnrollmentPagination;
}
