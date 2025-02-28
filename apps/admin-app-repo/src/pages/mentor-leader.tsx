import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'

const mentorLead = () => {
  return (
    <div>
          Coming soon
    </div>
  )
}

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

export default mentorLead