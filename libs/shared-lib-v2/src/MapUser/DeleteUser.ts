import { updateCohortMemberStatus } from '../DynamicForm/services/CohortService/cohortService';
import { getCohortList } from '../DynamicForm/services/GetCohortList';
import { updateUserTenantStatus } from '../DynamicForm/services/UserService';
import { RoleId } from '../utils/app.constant';

type DeleteUserParams = {
  userId: string;
  roleId: string;
  tenantId: string;
  reason?: string;
};

// adjust these based on your actual role ids/constants
const ROLES_ASSIGNED_TO_COHORTS = [RoleId.TEACHER, RoleId.TEAM_LEADER, RoleId.STUDENT];

export const deleteUser = async ({
  userId,
  roleId,
  tenantId,
  reason,
}: DeleteUserParams) => {
  try {
    const shouldHandleCohorts = ROLES_ASSIGNED_TO_COHORTS.includes(roleId as RoleId);

    /**
     * 1. Handle cohort archival ONLY for facilitator / lead roles
     */
    if (shouldHandleCohorts) {
      try {
        const userCohortResp = await getCohortList(userId);

        const membershipIds =
          userCohortResp?.result
            ?.filter((item: any) => item.cohortMemberStatus !== 'archived')
            ?.map((item: any) => item.cohortMembershipId) || [];

        for (const membershipId of membershipIds) {
          try {
            const updateResponse = await updateCohortMemberStatus({
              memberStatus: 'archived',
              statusReason: reason,
              membershipId,
            });

            if (updateResponse?.responseCode !== 200) {
              console.error(
                `Failed to archive cohort membership ${membershipId}`,
                updateResponse
              );
            }
          } catch (err) {
            console.error(
              `Error archiving cohort membership ${membershipId}`,
              err
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch cohort list:', err);
      }
    }

    /**
     * 2. Always archive user from tenant
     */
    const resp = await updateUserTenantStatus(userId, tenantId, {
      status: 'archived',
      ...(reason && { reason }),
    });

    if (resp?.responseCode !== 200) {
      console.error('Failed to archive user:', resp);
    }

    return resp;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
