export interface UserProfile {
  userid: string;
  username: string;
  fullname: string;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullname: string;
  phone: string;
}

export interface MyEnrollment {
  enrollmentid: string;
  isWaiting: boolean;
  approved: boolean;
  batchid: string;
  enrolledBy: string;
  createdAt: string;
  updatedAt: string;
  batch: {
    batchid: string;
    batchCode: string;
    capacity: number;
    startDate: string;
    classDays: string[];
    classTime: string;
    course: {
      courseid: string;
      title: string;
      level: string;
      fees: number;
      duration: number;
      imageURL: string | null;
    };
  };
}
