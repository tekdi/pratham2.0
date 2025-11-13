// Type definitions for Manager Dashboard components

export interface CourseData {
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface CourseCompletionData {
  mandatoryCourses: CourseData;
  nonMandatoryCourses: CourseData;
}

export interface CourseAllocationData {
  mandatory: number;
  nonMandatory: number;
  total: number;
}

export interface AchievementData {
  above40: number;
  between40and60: number;
  between60and90: number;
  below90: number;
  // Alternative naming used in CourseAchievement component
  completed100?: number;
  completed70to99?: number;
  completed50to69?: number;
  completedBelow50?: number;
}

export interface CourseAchievementData {
  mandatoryCourses: AchievementData;
  nonMandatoryCourses: AchievementData;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface TopPerformersData {
  categories: string[];
  usersData: { [key: string]: User[] };
  dateOptions: string[];
}

export interface DashboardData {
  courseCompletion: CourseCompletionData;
  courseAllocation: CourseAllocationData;
  courseAchievement: CourseAchievementData;
  topPerformers: TopPerformersData;
  totalEmployees: number;
}

// Individual Progress types
export interface EmployeeProgress {
  id: string;
  name: string;
  role: string;
  department: string;
  mandatoryCourses: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  };
  nonMandatoryCourses: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  };
  // Course identifiers arrays
  mandatoryInProgressIdentifiers?: string[];
  optionalInProgressIdentifiers?: string[];
  mandatoryCompletedIdentifiers?: string[];
  optionalCompletedIdentifiers?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

