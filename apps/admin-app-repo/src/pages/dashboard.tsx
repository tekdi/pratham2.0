// pages/dashboard.js
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <ProtectedRoute>
      <>
        <h1>{t("SIDEBAR.DASHBOARD")}</h1>
        <p>Welcome to your dashboard</p>
      </>
    </ProtectedRoute>
  );
};

export default Dashboard;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
