export interface Enrollment {
  enrollmentid: string;
  isWaiting: boolean;
  approved: boolean;
  batchid: string;
  enrolledBy: string;
  createdAt: string;
}

export interface CreateEnrollmentPayload {
  batchid: string;
  isWaiting: boolean;
}

export interface EnrollmentCourse {
  courseid: string;
  title: string;
  imageURL: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  fees: number;
  duration: number;
}

export interface MyEnrollment extends Enrollment {
  batch: {
    batchid: string;
    batchCode: string;
    capacity: number;
    startDate: string;
    classDays: string[];
    classTime: string;
    course: EnrollmentCourse;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}
