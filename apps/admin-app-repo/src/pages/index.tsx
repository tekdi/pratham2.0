import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Role, youthNetTenantName } from "@/utils/app.constant";

// const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

const Home: React.FC = () => {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token");
      setLoading(false);
      if (token) {
        const storedUserData = JSON.parse(
          localStorage.getItem("adminInfo") || "{}"
        );
        if(storedUserData?.role === Role.SCTA || storedUserData?.role === Role.CCTA){
          if(storedUserData?.tenantData[0]?.tenantName != youthNetTenantName.SECOND_CHANCE_PROGRAM ) {
            window.location.href = "/workspace";
            // window.location.href = "/course-planner"; 
          } else {
            // window.location.href = "/workspace"; 
            window.location.href = "/course-planner"; 
          }
        } 
        else
       if (storedUserData?.role === Role.CENTRAL_ADMIN && storedUserData?.tenantData[0]?.tenantName == youthNetTenantName.SECOND_CHANCE_PROGRAM) {

       push("/programs");
        }
        else if (storedUserData?.role === Role.ADMIN && storedUserData?.tenantData[0]?.tenantName == youthNetTenantName.SECOND_CHANCE_PROGRAM) {

       push("/centers");
        }
        else if (storedUserData?.role === Role.CENTRAL_ADMIN && storedUserData?.tenantData[0]?.tenantName == youthNetTenantName.YOUTHNET) {
       push("/mentor");
        }


      } else {
        push("/login", undefined, { locale: "en" });
      }
    }
  }, []);

  return <>{loading && <p>{t("COMMON.LOADING")}...</p>}</>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Home;
