import { ContentCreate } from '../utils/Interface';
import { URL_CONFIG } from '../utils/url.config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await axios.get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );

    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const fetchBulkContents = async (identifiers: string[]) => {
  try {
    const options = {
      request: {
        filters: {
          identifier: identifiers,
        },
        fields: [
          'name',
          'appIcon',
          'medium',
          'subject',
          'resourceType',
          'contentType',
          'organisation',
          'topic',
          'mimeType',
          'trackable',
          'gradeLevel',
          'leafNodes',
        ],
      },
    };
    const response = await axios.post(URL_CONFIG.API.COMPOSITE_SEARCH, options);

    const result = response?.data?.result;
    if (response?.data?.result?.QuestionSet?.length) {
      const contents = result?.content
        ? [...result.content, ...result.QuestionSet]
        : [...result.QuestionSet];
      result.content = contents;
    }

    return result.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getHierarchy = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.HIERARCHY_API}${identifier}`;
    const response = await axios.get(API_URL);

    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getQumlData = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.QUESTIONSET_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.HIERARCHY_FEILDS;
    const response = await axios.get(`${API_URL}?fields=${FIELDS}`);

    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const createContentTracking = async (reqBody: ContentCreate) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/content/create`;
  try {
    const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

    const response = await axios.post(apiUrl, reqBody, {
      headers: {
        ...(tenantId ? { tenantid: tenantId } : {}),
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createAssessmentTracking = async ({
  identifierWithoutImg,
  scoreDetails,
  courseId,
  unitId,
  userId: propUserId,
  maxScore,
  seconds,
}: any) => {
  try {
    let userId = '';
    if (propUserId) {
      userId = propUserId;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      userId = localStorage.getItem('userId') ?? '';
    }
    const attemptId = uuidv4();
    let totalScore = 0;
    if (Array.isArray(scoreDetails)) {
      totalScore = scoreDetails.reduce((sectionTotal, section) => {
        const sectionScore = section.data.reduce(
          (itemTotal: any, item: any) => {
            return itemTotal + (item.score || 0);
          },
          0
        );
        return sectionTotal + sectionScore;
      }, 0);
    } else {
      console.error('Parsed scoreDetails is not an array');
      throw new Error('Invalid scoreDetails format');
    }
    const lastAttemptedOn = new Date().toISOString();
    if (userId !== undefined || userId !== '') {
      const data: any = {
        userId: userId,
        contentId: identifierWithoutImg,
        courseId: courseId && unitId ? courseId : identifierWithoutImg,
        unitId: courseId && unitId ? unitId : identifierWithoutImg,
        attemptId,
        lastAttemptedOn,
        timeSpent: seconds ?? 0,
        totalMaxScore: maxScore ?? 0,
        totalScore,
        assessmentSummary: scoreDetails,
      };
      const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/create`;

      const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

      const response = await axios.post(apiUrl, data, {
        headers: {
          ...(tenantId ? { tenantid: tenantId } : {}),
        },
      });
      console.log('Assessment tracking created:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Error in contentWithTelemetryData:', error);
  }
};

const fetchCertificateStatus = async ({ userId, courseId }: any) => {
  try {
    const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/user_certificate/status/get`,
      { userId, courseId },
      {
        headers: {
          Authorization: localStorage.getItem('token') || '',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(tenantId ? { tenantid: tenantId } : {}),
        },
      }
    );
    const status = response.data?.result?.status;
    return status || 'No status found';
  } catch (error) {
    console.error('API call failed:', error);
    // return { error: error.message };
  }
};

export const updateCOurseAndIssueCertificate = async ({
  course,
  userId,
  unitId,
  isGenerateCertificate,
}: {
  course: any;
  userId: string;
  unitId: any;
  isGenerateCertificate?: boolean;
}) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/content/course/status`;
  const data = {
    courseId: [course?.identifier],
    userId: [userId],
  };

  try {
const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

const headers = {
  ...(tenantId && { tenantid: tenantId }),
};

const response = await axios.post(apiUrl, data, { headers });
    const courseStatus = calculateCourseStatus({
      statusData: response?.data?.data?.[0]?.course?.[0],
      allCourseIds: course.leafNodes ?? [],
      courseId: course?.identifier,
    });

    if (courseStatus?.status === 'in progress') {
      updateUserCourseStatus({
        userId,
        courseId: course?.identifier,
        status: 'inprogress',
      });
    } else if (courseStatus?.status === 'completed' && isGenerateCertificate) {
      const userResponse: any = await getUserId();
      const data = await fetchCertificateStatus({
        userId: userId,
        courseId: course?.identifier,
      });
      if (data !== 'viewCertificate') {
        const responseCriteria = await checkCriteriaForCertificate({
          userId: userId,
          courseId: course?.identifier,
        });

        if (responseCriteria === true) {
          try {
            await issueCertificate({
              userId: userId,
              courseId: course?.identifier,
              unitId: unitId,
              issuanceDate: new Date().toISOString(),
              expirationDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 20)
              ).toISOString(),
              // credentialId: data?.result?.usercertificateId,
              firstName: userResponse?.firstName ?? '',
              middleName: userResponse?.middleName ?? '',
              lastName: userResponse?.lastName ?? '',
              courseName: course?.name ?? '',
            });
          } catch (error) {
            await updateUserCourseStatus({
              userId,
              courseId: course?.identifier,
              status: 'completed',
            });
          }
        } else if (data !== 'completed') {
          await updateUserCourseStatus({
            userId,
            courseId: course?.identifier,
            status: 'completed',
          });
        }
      }
    } else {
      updateUserCourseStatus({
        userId,
        courseId: course?.identifier,
        status: 'completed',
      });
    }
  } catch (error) {
    console.error('Error in updateCOurseAndIssueCertificate:', error);
    throw error;
  }
};

export function calculateCourseStatus({
  statusData,
  allCourseIds,
  courseId,
}: {
  statusData: { completed_list: string[]; in_progress_list: string[] };
  allCourseIds: string[];
  courseId: string;
}) {
  const completedList = new Set(statusData.completed_list || []);
  const inProgressList = new Set(statusData.in_progress_list || []);

  let completedCount = 0;
  let inProgressCount = 0;
  const completed_list: string[] = [];
  const in_progress_list: string[] = [];

  for (const id of allCourseIds) {
    if (completedList.has(id)) {
      completedCount++;
      completed_list.push(id);
    } else if (inProgressList.has(id)) {
      inProgressCount++;
      in_progress_list.push(id);
    }
  }

  const total = allCourseIds.length;
  let status = 'not started';

  if (completedCount === total && total > 0) {
    status = 'completed';
  } else if (completedCount > 0 || inProgressCount > 0) {
    status = 'in progress';
  }

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completed_list,
    in_progress_list,
    completed: completedCount,
    in_progress: inProgressCount,
    courseId,
    status,
    percentage: percentage,
  };
}

export const updateUserCourseStatus = async ({
  userId,
  courseId,
  status,
}: {
  userId: string;
  courseId: string;
  status: string;
}) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/user_certificate/status/update`;
  try {
    const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

    const response = await axios.post(
      apiUrl,
      {
        userId,
        courseId,
        status,
      },
      {
        headers: {
          ...(tenantId ? { tenantid: tenantId } : {}),
        },
      }
    );
    return response?.data?.result;
  } catch (error) {
    console.error('error in updating user course status', error);
    throw error;
  }
};

//check criteria for certificate
export const checkCriteriaForCertificate = async (reqBody: any) => {
  const userId = reqBody?.userId;
  const courseId = reqBody?.courseId;
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/course/v1/hierarchy/${courseId}`;

  try {
    const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

    const response = await axios.get(apiUrl, {
      headers: {
        ...(tenantId ? { tenantid: tenantId } : {}),
      },
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

export const issueCertificate = async (reqBody: any) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/certificate/issue`;
  try {
    const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null;

    const response = await axios.post(apiUrl, reqBody, {
      headers: {
        ...(tenantId ? { tenantid: tenantId } : {}),
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserId = async (): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/auth`;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching user details', error);
    throw error;
  }
};
