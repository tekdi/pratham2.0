import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

const mentor = () => {
  return (
    <div>Coming soon</div>
  )
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default mentor