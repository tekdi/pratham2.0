import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import CourseTable from '@/components/LearnerCourses/CourseTable';

const CoursesLearners: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <CourseTable />
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CoursesLearners;
