// Manager Dashboard API Service
// This file contains all API calls for the Manager Dashboard
// Currently using dummy data - replace with actual API endpoints

import {
  CourseCompletionData,
  CourseAllocationData,
  CourseAchievementData,
  TopPerformersData,
  DashboardData,
} from '../components/ManagerDashboard/types';

// Base API URL - should be configured in environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

/**
 * Fetches course completion data
 * @returns Promise with course completion statistics
 */
export const getCourseCompletionData =
  async (): Promise<CourseCompletionData> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/manager/course-completion`);
      // const data = await response.json();
      // return data;

      // Dummy data
      return {
        mandatoryCourses: {
          completed: 20,
          inProgress: 32,
          overdue: 4,
        },
        nonMandatoryCourses: {
          completed: 20,
          inProgress: 32,
          overdue: 4,
        },
      };
    } catch (error) {
      console.error('Error fetching course completion data:', error);
      throw error;
    }
  };

/**
 * Fetches course allocation data
 * @returns Promise with course allocation statistics
 */
export const getCourseAllocationData =
  async (): Promise<CourseAllocationData> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/manager/course-allocation`);
      // const data = await response.json();
      // return data;

      // Dummy data
      return {
        mandatory: 46,
        nonMandatory: 38,
        total: 84,
      };
    } catch (error) {
      console.error('Error fetching course allocation data:', error);
      throw error;
    }
  };

/**
 * Fetches course achievement data
 * @returns Promise with course achievement statistics
 */
export const getCourseAchievementData =
  async (): Promise<CourseAchievementData> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/manager/course-achievement`);
      // const data = await response.json();
      // return data;

      // Dummy data
      return {
        mandatoryCourses: {
          above40: 15,
          between40and60: 20,
          between60and90: 12,
          below90: 9,
        },
        nonMandatoryCourses: {
          above40: 18,
          between40and60: 22,
          between60and90: 10,
          below90: 6,
        },
      };
    } catch (error) {
      console.error('Error fetching course achievement data:', error);
      throw error;
    }
  };

/**
 * Fetches top performers and attention cohorts data
 * @param dateFilter - Optional date filter
 * @returns Promise with top performers data
 */
export const getTopPerformersData = async (
  dateFilter?: string
): Promise<TopPerformersData> => {
  try {
    // TODO: Replace with actual API call
    // const url = new URL(`${API_BASE_URL}/manager/top-performers`);
    // if (dateFilter) {
    //   url.searchParams.append('date', dateFilter);
    // }
    // const response = await fetch(url.toString());
    // const data = await response.json();
    // return data;

    // Dummy data
    return {
      categories: [
        '5 Highest Course Completing Users',
        '5 Lowest Course Completing Users',
        'Most Active Users',
        'Least Active Users',
      ],
      usersData: {
        '5 Highest Course Completing Users': [
          { id: '1', name: 'Rahul Somshekhar', role: 'Facilitator' },
          { id: '2', name: 'Priya Sharma', role: 'Teacher' },
          { id: '3', name: 'Amit Patel', role: 'Facilitator' },
          { id: '4', name: 'Sneha Reddy', role: 'Teacher' },
          { id: '5', name: 'Vikram Singh', role: 'Facilitator' },
          { id: '6', name: 'Anjali Mehta', role: 'Teacher' },
        ],
        '5 Lowest Course Completing Users': [
          { id: '1', name: 'Karan Verma', role: 'Teacher' },
          { id: '2', name: 'Divya Nair', role: 'Facilitator' },
          { id: '3', name: 'Rohit Kumar', role: 'Teacher' },
          { id: '4', name: 'Pooja Gupta', role: 'Facilitator' },
          { id: '5', name: 'Sanjay Desai', role: 'Teacher' },
        ],
        'Most Active Users': [
          { id: '1', name: 'Meera Iyer', role: 'Facilitator' },
          { id: '2', name: 'Arjun Rao', role: 'Teacher' },
          { id: '3', name: 'Deepak Shah', role: 'Facilitator' },
          { id: '4', name: 'Ritu Malhotra', role: 'Teacher' },
        ],
        'Least Active Users': [
          { id: '1', name: 'Suresh Kumar', role: 'Teacher' },
          { id: '2', name: 'Lakshmi Nair', role: 'Facilitator' },
          { id: '3', name: 'Rahul Verma', role: 'Teacher' },
        ],
      },
      dateOptions: [
        'As of today, 5th Sep',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
      ],
    };
  } catch (error) {
    console.error('Error fetching top performers data:', error);
    throw error;
  }
};

/**
 * Fetches all dashboard data at once
 * @returns Promise with complete dashboard data
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch all data in parallel
    const [courseCompletion, courseAllocation, courseAchievement, topPerformers] =
      await Promise.all([
        getCourseCompletionData(),
        getCourseAllocationData(),
        getCourseAchievementData(),
        getTopPerformersData(),
      ]);

    return {
      courseCompletion,
      courseAllocation,
      courseAchievement,
      topPerformers,
      totalEmployees: 56, // TODO: Get from API
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Example of how to use with axios (if preferred)
 * 
 * import axios from 'axios';
 * 
 * export const getCourseCompletionData = async (): Promise<CourseCompletionData> => {
 *   const response = await axios.get(`${API_BASE_URL}/manager/course-completion`);
 *   return response.data;
 * };
 */

