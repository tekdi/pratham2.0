import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { useTranslation } from '@shared-lib';

interface JotFormEmbedProps {
  formId: string;
  queryParams: Record<string, string | number | boolean>; // Dynamic query parameters
}

const JotFormEmbed: React.FC<JotFormEmbedProps> = ({ formId, queryParams }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return (
    <>
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <iframe
        id="jotform-embed"
        title="Query Form"
        src={`${process.env.NEXT_PUBLIC_JOTFORM_URL}/${formId}?${queryString}`}
        style={{
          minWidth: '100%',
          maxWidth: '100%',
          height: '80vh',
          border: 'none',
          display: loading ? 'none' : 'block',
        }}
        onLoad={() => setLoading(false)}
      ></iframe>
      <script src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"></script>
    </>
  );
};

export default JotFormEmbed;
