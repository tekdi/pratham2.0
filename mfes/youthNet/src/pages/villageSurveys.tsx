import withRole from '../components/withRole';
import React from 'react';
import { TENANT_DATA } from '../utils/app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const villageSurveys = () => {
  return <div>villageSurveys</div>;
};

export default withRole(TENANT_DATA.YOUTHNET)(villageSurveys);
