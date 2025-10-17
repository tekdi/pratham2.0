export interface CourseCompletionData {
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface EmployeeCourse {
  id: string;
  title: string;
  description: string;
  completedDate?: string;
  image: string;
  certificateUrl?: string;
}

export interface EmployeeDetailsData {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  dateOfJoining: string;
  jobType: string;
  department: string;
  reportingManager: string;
  courseCompletion: {
    mandatory: CourseCompletionData;
    nonMandatory: CourseCompletionData;
  };
  overdueCourses: EmployeeCourse[];
  ongoingCourses: EmployeeCourse[];
  completedCourses: EmployeeCourse[];
}

export interface ContactInformationProps {
  email: string;
  phone: string;
}

export interface LearnerDetailsProps {
  employeeId: string;
  dateOfJoining: string;
  jobType: string;
  department: string;
  reportingManager: string;
}

export interface ExpandableCourseSectionProps {
  title: string;
  count: number;
  courses: EmployeeCourse[];
  defaultExpanded?: boolean;
}

export interface CourseCardProps {
  course: EmployeeCourse;
}

