import React, { useState } from 'react';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';

interface AppScriptEmbedProps {
  scriptUrl: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
  height?: string;
  title?: string;
}

const AppScriptEmbed: React.FC<AppScriptEmbedProps> = ({
  scriptUrl,
  queryParams = {},
  height = '80vh',
  title = 'Support Request Form',
}) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const src = queryString ? `${scriptUrl}?${queryString}` : scriptUrl;

  if (!scriptUrl) return null;

  // No sandbox attr: Apps Script renders inside its own nested
  // googleusercontent iframe and a sandbox breaks that nesting.
  return (
    <>
      {loading && <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />}
      <iframe
        id="app-script-embed"
        title={title}
        src={src}
        style={{
          minWidth: "100%",
          maxWidth: "100%",
          height,
          border: "none",
          display: loading ? 'none' : 'block',
        }}
        onLoad={() => setLoading(false)}
      ></iframe>
    </>
  );
};

export default AppScriptEmbed;
