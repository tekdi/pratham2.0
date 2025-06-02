'use client'
import PDFViewerWithLanguage from '@learner/components/PDFViewerWithLanguage/PDFViewerWithLanguage';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import Layout from '@learner/components/Layout';
import { useTranslation } from '@shared-lib';

const FAQS = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();


  const getPdfUrl = (language: string) => {
    //temporary add that pdfs
    return `/files/${
      language === 'english'
        ? 'consent_form_above_18_hindi.pdf'
        : 'consent_form_below_18_hindi.pdf'
    }`;
  };

  return (
    <Layout>
    <PDFViewerWithLanguage getPdfUrl={getPdfUrl} title={t('COMMON.FAQS')} />

    </Layout>
  );
};



export default FAQS;
