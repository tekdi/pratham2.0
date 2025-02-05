import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";
import HeaderComponent from "@/components/HeaderComponent";

const MainCourse = () => {
  const { t } = useTranslation();
  return (
    <ProtectedRoute>
      <>
        <h1>{t("SIDEBAR.MAIN_COURSE")}</h1>
        <HeaderComponent></HeaderComponent>
      </>
    </ProtectedRoute>
  );
};

export default MainCourse;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
