import { Role, RoleId, TenantName } from "@/utils/app.constant";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminInfo = localStorage.getItem("adminInfo");

    if (!token || !adminInfo) {
      if (router.pathname !== "/login" && router.pathname !== "/logout") {
        if (typeof window !== 'undefined' && window.localStorage) {
          // Specify the keys you want to keep
          const keysToKeep = [
            'preferredLanguage',
            'mui-mode',
            'mui-color-scheme-dark',
            'mui-color-scheme-light',
            'hasSeenTutorial',
          ];
          // Retrieve the values of the keys to keep
          const valuesToKeep: { [key: string]: any } = {};
          keysToKeep.forEach((key: string) => {
            valuesToKeep[key] = localStorage.getItem(key);
          });

          // Clear all local storage
          localStorage.clear();

          // Re-add the keys to keep with their values
          keysToKeep.forEach((key: string) => {
            if (valuesToKeep[key] !== null) {
              // Check if the key exists and has a value
              localStorage.setItem(key, valuesToKeep[key]);
            }
          });
        }
        router.push("/logout");
      }
      return;
    }

    const user = JSON.parse(adminInfo);
    const selectedTenantId = localStorage.getItem("tenantId");
    const selectedTenant =
      user?.tenantData?.find((tenant: any) => tenant.tenantId === selectedTenantId) ||
      user?.tenantData?.[0];

    const allowedPaths = ["/workspace","/course-planner", "/subjectDetails","/stateDetails" ];
    const notAllowedPathsForCentralAdmin = ["/team-leader", "/faciliator", "/learners", "/centers", "/certificate-issuance", "/mentor", "/central-head", "/user-leader" ];

    const isWorkspaceContent = router.pathname.startsWith("/workspace");
    const coursePlannerPaths = [
      // "/course-planner",
      "/subjectDetails",
      "/stateDetails",
      "/upload-editor",
      "/sunbirdPlayers",
      "/editor",
      "/collection",
      "/importCsv",
      "/resourceList",
      "/csvDetails",
      "/csvList",
      "/play",
      "/edit-password",
      "/course-hierarchy"
    ];

    // const youthNetAllowed = [
    //   "/mentor",
    //   "/mentor-leader",
    //   "/support-request"
    // ];

    const youthNetNotAllowed = [
      '/centers',
      '/programs',
      '/team-leader',
      '/faciliator',
      '/learners',
      '/notification-templates',
      '/course-planner',
      '/stateDetails',
      '/subjectDetails',
      '/importCsv',
      '/resourceList',
      '/play/content/[identifier]',
      '/workspace',
      '/course-hierarchy/[identifier]'
    ];



    const isCoursePlannerContent = coursePlannerPaths.some((path) =>
      router.pathname.startsWith(path)
    );

    if ((user.role === Role.SCTA || user.role === Role.CCTA) && !(allowedPaths.includes(router.pathname) || isWorkspaceContent || isCoursePlannerContent)) {
      if (router.pathname !== "/login" && router.pathname !== "/logout") {
        if (typeof window !== 'undefined' && window.localStorage) {
          // Specify the keys you want to keep
          const keysToKeep = [
            'preferredLanguage',
            'mui-mode',
            'mui-color-scheme-dark',
            'mui-color-scheme-light',
            'hasSeenTutorial',
          ];
          // Retrieve the values of the keys to keep
          const valuesToKeep: { [key: string]: any } = {};
          keysToKeep.forEach((key: string) => {
            valuesToKeep[key] = localStorage.getItem(key);
          });

          // Clear all local storage
          // localStorage.clear();

          // // Re-add the keys to keep with their values
          // keysToKeep.forEach((key: string) => {
          //   if (valuesToKeep[key] !== null) {
          //     // Check if the key exists and has a value
          //     localStorage.setItem(key, valuesToKeep[key]);
          //   }
          // });
        }
        router.push("/unauthorized");
      }
    }


    if (
      user.role === Role.ADMIN &&
      selectedTenant?.tenantName === TenantName.YOUTHNET &&
      youthNetNotAllowed.some(route => router.pathname.startsWith(route))
    ) {
      router.push("/unauthorized");
    }

    const isSecondChanceTenant =
      selectedTenant?.tenantName === TenantName.SECOND_CHANCE_PROGRAM ||
      selectedTenant?.tenantName === TenantName.SECOND_CHANCE_PROGRAM_PATHWAYS;

    if ((((user.role === Role.ADMIN && isSecondChanceTenant) || (user.role === Role.CENTRAL_ADMIN && isSecondChanceTenant)) && (allowedPaths.includes(router.pathname) || isWorkspaceContent || isCoursePlannerContent)) || (user.role === Role.ADMIN && (router.pathname === "/programs" || router.pathname === "/notification-templates"))) {
      if (router.pathname !== "/login" && router.pathname !== "/logout" && router.pathname !== "/edit-password") {

        router.push("/unauthorized");
      }
      if(isSecondChanceTenant &&  router.pathname === "/certificate-issuance")
      {
        router.push("/unauthorized");
      }
    }
    if((user.role === Role.CENTRAL_ADMIN  && isSecondChanceTenant) && notAllowedPathsForCentralAdmin.includes(router.pathname))
    {
      if (router.pathname !== "/login" && router.pathname !== "/logout" && router.pathname !== "/edit-password") {

        router.push("/unauthorized");
      }
    }
  }, [router.pathname]);

  return <>{children}</>;
};

export default RouteGuard;
