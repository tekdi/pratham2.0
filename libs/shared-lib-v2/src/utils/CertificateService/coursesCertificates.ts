import axios, { AxiosResponse } from 'axios';
import { post } from '../API/RestClient';
import { API_ENDPOINTS } from '../API/EndUrls';

export interface courseWiseLernerListParam {
  limit?: number;
  offset?: number;
  filters: {
    status?: string[];
  };
}
export interface issueCertificateParam {
  issuanceDate?: string;
  expirationDate?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  userId?: string;
  courseId?: string;
  courseName?: string;
}
export interface renderCertificateParam {
  credentialId?: string;
  templateId?: string;
}
export const courseWiseLernerList = async ({
  limit,
  offset,
  filters,
}: courseWiseLernerListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.courseWiseLernerList;
  try {
    const response = await post(apiUrl, {
      limit,
      filters,
      offset,
    });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting user list', error);
    throw error;
  }
};

export const getCourseName = async (courseIds: string[]): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.getCourseName;
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      request: {
        filters: {
          identifier: [...courseIds],
        },
        fields: ['name'],
      },
    };
    const response = await post(apiUrl, data, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting in course name', error);
    throw error;
  }
};

//check criteria for certificate
export const checkCriteriaForCertificate = async (reqBody: any) => {
  const userId = reqBody?.userId;
  const courseId = reqBody?.courseId;
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/course/v1/hierarchy/${courseId}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {},
    });

    if (Object.keys(response?.data?.result?.content).length > 0) {
      const content = response?.data?.result?.content;

      // Extract question set identifiers with their parent unit IDs
      const questionSetData: Array<{ contentId: string; unitId: string }> = [];

      const extractQuestionSets = (node: any, parentId?: string) => {
        // Check if current node is a question set
        if (node.mimeType === 'application/vnd.sunbird.questionset') {
          questionSetData.push({
            contentId: node.identifier,
            unitId: parentId || node.parent || '',
          });
        }

        // Recursively traverse children if they exist
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            // Pass the current node's identifier as parent for its children
            extractQuestionSets(child, node.identifier);
          });
        }
      };

      // Start extraction from the root content
      extractQuestionSets(content);

      console.log('Question Set Data:', questionSetData);

      //tenantId
      const tenantId = localStorage.getItem('tenantId');
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        tenantId: tenantId,
      };

      // You can now use questionSetData array for further processing
      // Example output: [{contentId: "do_214302433656496128152", unitId: "do_214373529013116928121"}]

      // Add your additional logic here using questionSetData
      if (questionSetData.length > 0) {
        // Process each question set data
        let criteriaCompleted = false;
        let statusUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/search/status`;
        // Collect all contentIds and unitIds
        const contentIds = questionSetData.map((item) => item.contentId);
        const unitIds = questionSetData.map((item) => item.unitId);
        const options = {
          userId: [userId],
          courseId: [courseId], // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId: unitIds,
          contentId: contentIds,
        };
        const response = await axios.post(statusUrl, options, {
          headers: headers,
        });
        console.log(response?.data?.data);

        if (response?.data?.data?.length > 0) {
          // Filter data for specific userId
          const userData = response?.data?.data.find(
            (item: any) => item.userId === userId
          );

          if (userData) {
            const assessments = userData?.assessments || [];

            // Check if all contentIds are present in the response
            const foundContentIds = assessments.map(
              (assessment: any) => assessment.contentId
            );
            const allContentIdsFound = contentIds.every((contentId) =>
              foundContentIds.includes(contentId)
            );

            if (allContentIdsFound) {
              // Check if all assessments have percentage >= 40%
              const allPassed = assessments.every((assessment: any) => {
                const percentage = parseFloat(assessment.percentage);
                return percentage >= 40;
              });

              criteriaCompleted = allPassed;
            } else {
              criteriaCompleted = false;
            }
          } else {
            criteriaCompleted = false;
          }
        } else {
          criteriaCompleted = false;
        }

        if (criteriaCompleted) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const checkCourseScore = async (reqBody: any) => {
  const userId = reqBody?.userId;
  const courseId = reqBody?.courseId;
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/course/v1/hierarchy/${courseId}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {},
    });

    if (Object.keys(response?.data?.result?.content).length > 0) {
      const content = response?.data?.result?.content;

      // Extract question set identifiers with their parent unit IDs
      const questionSetData: Array<{ contentId: string; unitId: string }> = [];

      const extractQuestionSets = (node: any, parentId?: string) => {
        // Check if current node is a question set
        if (node.mimeType === 'application/vnd.sunbird.questionset') {
          questionSetData.push({
            contentId: node.identifier,
            unitId: parentId || node.parent || '',
          });
        }

        // Recursively traverse children if they exist
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            // Pass the current node's identifier as parent for its children
            extractQuestionSets(child, node.identifier);
          });
        }
      };

      // Start extraction from the root content
      extractQuestionSets(content);

      console.log('Question Set Data:', questionSetData);

      //tenantId
      const tenantId = localStorage.getItem('tenantId');
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        tenantId: tenantId,
      };

      // You can now use questionSetData array for further processing
      // Example output: [{contentId: "do_214302433656496128152", unitId: "do_214373529013116928121"}]

      // Add your additional logic here using questionSetData
      if (questionSetData.length > 0) {
        // Process each question set data
        let criteriaCompleted = false;
        let statusUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/search/status`;
        // Collect all contentIds and unitIds
        const contentIds = questionSetData.map((item) => item.contentId);
        const unitIds = questionSetData.map((item) => item.unitId);
        const options = {
          userId: [userId],
          courseId: [courseId], // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId: unitIds,
          contentId: contentIds,
        };
        const response = await axios.post(statusUrl, options, {
          headers: headers,
        });
        console.log(response?.data?.data);

        if (response?.data?.data?.length > 0) {
          // Filter data for specific userId
          const userData = response?.data?.data.find(
            (item: any) => item.userId === userId
          );

          if (userData) {
            const percentageString = userData?.percentageString;
            const percentage = userData?.percentage;
            const status = userData?.status;
            return { percentageString, percentage, status };
          } else {
            return {};
          }
        } else {
          return {};
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const issueCertificate = async (
  payload: issueCertificateParam
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.issueCertificate;
  try {
    const response = await post(apiUrl, payload);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting user list', error);
    throw error;
  }
};

export const renderCertificate = async ({
  credentialId,
  templateId,
}: renderCertificateParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.renderCertificate;
  try {
    const response = await post(apiUrl, { credentialId, templateId });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting render certificate', error);
    throw error;
  }
};

export const downloadCertificate = async ({
  credentialId,
  templateId,
}: renderCertificateParam): Promise<Blob> => {
  const apiUrl: string = API_ENDPOINTS.downloadCertificate;
  try {
    const response: AxiosResponse<Blob> = await axios.post(
      apiUrl,
      { credentialId, templateId },
      {
        responseType: 'blob', // Ensures we get a binary file
      }
    );

    if (!response.data) {
      throw new Error('Empty response from API');
    }

    return response.data; // Return only the Blob data
  } catch (error) {
    console.error('Error in getting render certificate:', error);
    throw error;
  }
};
