import { useRef } from 'react';
import { useRouter } from 'next/router';
import { getUserDetailsInfo } from '@/services/UserList';
import { getTenantInfo } from '@/services/LoginService';
import { getAcademicYear } from '@/services/AcademicYearService';
import TenantService from '@/services/TenantService';
import { useUserIdStore } from '@/store/useUserIdStore';
import useSubmittedButtonStore from '@/utils/useSharedState';
import useStore from '@/store/store';
import { transformLabel } from '@/utils/helper';
import { Role, Storage, TenantName, isSecondChanceTenant } from '@/utils/app.constant';
import { AcademicYear } from '@/utils/Interfaces';

export interface AccountSwitchTarget {
  tenantId: string;
  tenantName: string;
  tenantType: string;
  roleId: string;
  roleName: string;
  userResponse: any;
}

export const useAccountSwitch = () => {
  const router = useRouter();
  const { setUserId } = useUserIdStore();
  const setAdminInformation = useSubmittedButtonStore(
    (state: any) => state.setAdminInformation
  );
  const setIsActiveYearSelected = useStore(
    (state: { setIsActiveYearSelected: any }) => state.setIsActiveYearSelected
  );

  const isFetchingTenantInfo = useRef<boolean>(false);
  const isFetchingUserDetail = useRef<boolean>(false);

  const fetchTenantInfo = async () => {
    if (isFetchingTenantInfo.current) {
      return;
    }
    isFetchingTenantInfo.current = true;
    const storedTenantId = localStorage.getItem('tenantId');
    try {
      const res = await getTenantInfo();
      const programsData = res?.result || [];
      const tenant = programsData.find(
        (item: { tenantId: string | null }) => item.tenantId === storedTenantId
      );

      if (tenant?.domain) {
        localStorage.setItem('tenantDomain', tenant.domain);
      }
    } catch (error) {
      console.error('Failed to fetch tenant info:', error);
    } finally {
      isFetchingTenantInfo.current = false;
    }
  };

  const fetchUserDetail = async () => {
    if (isFetchingUserDetail.current) {
      return;
    }

    isFetchingUserDetail.current = true;
    let userId;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        userId = localStorage.getItem(Storage.USER_ID);
      }
      const fieldValue = true;
      if (userId) {
        const tenantId =
          typeof window !== 'undefined' && window.localStorage
            ? localStorage.getItem('tenantId')
            : '';
        const tenantName =
          typeof window !== 'undefined' && window.localStorage
            ? localStorage.getItem('tenantName')
            : '';
        const roleId =
          typeof window !== 'undefined' && window.localStorage
            ? localStorage.getItem('roleId')
            : '';
        const roleName =
          typeof window !== 'undefined' && window.localStorage
            ? localStorage.getItem('roleName')
            : '';
        const program = tenantName;

        const response = await getUserDetailsInfo(userId, fieldValue);
        localStorage.setItem(
          'temporaryPassword',
          response?.userData?.temporaryPassword ?? 'false'
        );

        const userInfo = response?.userData;
        // Override role with selected role from SwitchAccount (ensures correct redirect)
        try {
          if (userInfo && roleName) {
            (userInfo as any).role = roleName;
          }
          if (userInfo && roleId) {
            (userInfo as any).roleId = roleId;
          }
        } catch (e) {
          console.error('Error overriding role in userInfo:', e);
        }

        const selectedTenantData = userInfo?.tenantData?.find(
          (tenant: any) => tenant.tenantId === tenantId
        );

        if (typeof window !== 'undefined' && window.localStorage) {
          if (userInfo) {
            if (userInfo?.customFields) {
              const boardField = userInfo.customFields.find(
                (field: any) => field.label === 'BOARD'
              );

              const boardValues = boardField?.selectedValues || [];

              if (boardValues.length > 0) {
                localStorage.setItem(
                  'userSpecificBoard',
                  JSON.stringify(boardValues)
                );
              }
            }

            localStorage.setItem('adminInfo', JSON.stringify(userInfo));

            localStorage.setItem('tenantId', tenantId || '');
            localStorage.setItem('tenantName', tenantName || '');
            localStorage.setItem(
              'uiConfig',
              JSON.stringify(selectedTenantData?.params?.uiConfig || {})
            );
            localStorage.setItem('roleId', roleId || '');
            localStorage.setItem('roleName', roleName || '');
            localStorage.setItem('program', program || '');
          }
          const selectedStateName = transformLabel(
            userInfo?.customFields?.find(
              (field: { label: string }) => field?.label === 'WORKING_STATE'
            )?.selectedValues?.[0]?.value
          );
          if (selectedStateName) {
            localStorage.setItem('stateName', selectedStateName);
          }
          const selectedStateId = userInfo?.customFields?.find(
            (field: { label: string }) => field?.label === 'WORKING_STATE'
          )?.selectedValues?.[0]?.id;
          if (selectedStateId !== undefined && selectedStateId !== null) {
            localStorage.setItem('stateId', selectedStateId);
          }
        }

        setAdminInformation(userInfo);

        const tenantData = selectedTenantData;

        if (tenantData?.tenantType === 'elearning') {
          if (
            userInfo?.role === Role.CENTRAL_ADMIN &&
            tenantData?.tenantName == TenantName.CAMP_TO_CLUB
          ) {
            const { locale } = router;
            if (locale) {
              window.location.href = '/learners';
              router.push('/learners', undefined, { locale: locale });
            } else {
              window.location.href = '/learners';
              router.push('/learners');
            }
          }
          if (userInfo?.role === Role.SCTA || userInfo?.role === Role.CCTA) {
            const { locale } = router;
            // To do :- hardcoding to be removed
            if (!isSecondChanceTenant(tenantData?.tenantName)) {
              window.location.href = '/faqs';
              router.push('/faqs');
            } else {
              window.location.href = '/course-planner';
              if (locale) {
                router.push('/course-planner', undefined, {
                  locale: locale,
                });
              } else router.push('/course-planner');
            }
          } else if (
            userInfo?.role === Role.CENTRAL_ADMIN &&
            tenantData?.tenantName == TenantName.PRAGYANPATH
          ) {
            window.location.href = '/youth';
            router.push('/youth');
          } else {
            const { locale } = router;
            if (locale) {
              if (
                userInfo?.role === Role.CENTRAL_ADMIN &&
                isSecondChanceTenant(tenantData?.tenantName)
              ) {
                window.location.href = '/programs';
                router.push('/programs', undefined, { locale: locale });
              } else if (
                userInfo?.role === Role.ADMIN &&
                isSecondChanceTenant(tenantData?.tenantName)
              ) {
                window.location.href = '/centers';
                router.push('/centers', undefined, { locale: locale });
              } else if (
                userInfo?.role === Role.ADMIN ||
                (Role.CENTRAL_ADMIN &&
                  tenantData?.tenantName == TenantName.YOUTHNET)
              ) {
                window.location.href = '/user-leader';
                router.push('/user-leader', undefined, { locale: locale });
              }
            } else if (
              userInfo?.role === Role.CENTRAL_ADMIN &&
              isSecondChanceTenant(tenantData?.tenantName)
            ) {
              window.location.href = '/programs';
              router.push('/programs');
            } else if (
              userInfo?.role === Role.ADMIN &&
              isSecondChanceTenant(tenantData?.tenantName)
            ) {
              window.location.href = '/centers';
              router.push('/centers');
            } else if (
              userInfo?.role === Role.ADMIN &&
              tenantData?.tenantName == TenantName.YOUTHNET
            ) {
              window.location.href = '/user-leader';
              router.push('/user-leader');
            }
          }
        } else {
          // For other tenants, proceed with academic year logic
          const academicYearList: AcademicYear[] = await getAcademicYear();
          if (academicYearList) {
            localStorage.setItem(
              'academicYearList',
              JSON.stringify(academicYearList)
            );
            const extractedAcademicYears = academicYearList?.map(
              ({ id, session, isActive }) => ({ id, session, isActive })
            );
            const activeSession = extractedAcademicYears?.find(
              (item) => item.isActive
            );
            const activeSessionId = activeSession ? activeSession.id : '';
            localStorage.setItem('academicYearId', activeSessionId);
            localStorage.setItem('session', activeSession?.session ?? '');
            if (activeSessionId) {
              setIsActiveYearSelected(true);
              if (
                userInfo?.role === Role.SCTA ||
                userInfo?.role === Role.CCTA
              ) {
                const { locale } = router;
                // To do :- hardcoding to be removed
                if (
                  !isSecondChanceTenant(tenantData?.tenantName)
                ) {
                  window.location.href = '/faqs';
                  router.push('/faqs');
                } else {
                  window.location.href = '/course-planner';
                  if (locale) {
                    router.push('/course-planner', undefined, {
                      locale: locale,
                    });
                  } else router.push('/course-planner');
                }
              } else {
                const { locale } = router;
                if (locale) {
                  if (
                    userInfo?.role === Role.CENTRAL_ADMIN &&
                    isSecondChanceTenant(tenantData?.tenantName)
                  ) {
                    window.location.href = '/programs';
                    router.push('/programs', undefined, { locale: locale });
                  } else if (
                    userInfo?.role === Role.ADMIN &&
                    isSecondChanceTenant(tenantData?.tenantName)
                  ) {
                    window.location.href = '/centers';
                    router.push('/centers', undefined, { locale: locale });
                  } else if (
                    userInfo?.role === Role.ADMIN ||
                    (Role.CENTRAL_ADMIN &&
                      tenantData?.tenantName == TenantName.YOUTHNET)
                  ) {
                    window.location.href = '/user-leader';
                    router.push('/user-leader', undefined, {
                      locale: locale,
                    });
                  }
                } else if (
                  userInfo?.role === Role.CENTRAL_ADMIN &&
                  isSecondChanceTenant(tenantData?.tenantName)
                ) {
                  window.location.href = '/programs';
                  router.push('/programs');
                } else if (
                  userInfo?.role === Role.ADMIN &&
                  isSecondChanceTenant(tenantData?.tenantName)
                ) {
                  window.location.href = '/centers';
                  router.push('/centers');
                } else if (
                  userInfo?.role === Role.ADMIN &&
                  tenantData?.tenantName == TenantName.YOUTHNET
                ) {
                  window.location.href = '/user-leader';
                  router.push('/user-leader');
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      isFetchingUserDetail.current = false;
    }
  };

  const performAccountSwitch = async ({
    tenantId,
    tenantName,
    roleId,
    roleName,
    userResponse,
  }: AccountSwitchTarget) => {
    if (!userResponse) {
      return;
    }
    const token = localStorage.getItem('token');
    localStorage.setItem('userId', userResponse?.userId);
    const tenant = userResponse?.tenantData?.find(
      (item: any) => item.tenantId === tenantId
    );
    const templateId = tenant?.templateId;
    localStorage.setItem('templtateId', templateId);
    localStorage.setItem('tenantName', tenantName);
    localStorage.setItem('roleId', roleId);
    localStorage.setItem('roleName', roleName);
    localStorage.setItem('userIdName', userResponse?.username);
    setUserId(userResponse?.userId || '');

    if (userResponse?.userId) {
      document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
      document.cookie = `userId=${userResponse.userId}; path=/; secure; SameSite=Strict`;
    }

    localStorage.setItem('name', userResponse?.firstName);
    localStorage.setItem(Storage.USER_DATA, JSON.stringify(userResponse));
    const frameworkId = tenant?.collectionFramework;
    const channel = tenant?.channelId;
    TenantService.setTenantId(tenantId);
    localStorage.setItem('collectionFramework', frameworkId);
    localStorage.setItem('channelId', channel);
    localStorage.setItem('tenantId', tenantId);

    fetchTenantInfo();
    await fetchUserDetail();
  };

  return {
    fetchUserDetail,
    fetchTenantInfo,
    performAccountSwitch,
    isFetchingUserDetail,
    isFetchingTenantInfo,
  };
};
