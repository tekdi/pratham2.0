import Header from '@/components/Header';
import PDFViewerWithLanguage from '@/components/PDFViewerWithLanguage/PDFViewerWithLanguage';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const FAQS = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();


  const getPdfUrl = (language: string) => {
    //temporary add that pdfs
    return `/scp-teacher-repo/files/${
      language === 'english'
        ? 'consent_form_above_18_hindi.pdf'
        : 'consent_form_below_18_hindi.pdf'
    }`;
  };

  return (
    <>
      <Header />
      <PDFViewerWithLanguage getPdfUrl={getPdfUrl} title={t('COMMON.FAQS')} />
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

export default FAQS;
