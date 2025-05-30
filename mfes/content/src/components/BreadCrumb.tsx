import React, { memo } from 'react';
import { Breadcrumbs, Button, Typography, useTheme } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';

const BreadCrumb = ({
  breadCrumbs,
  topic,
  isShowLastLink,
}: {
  breadCrumbs: any;
  topic?: string;
  isShowLastLink?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadCrumbs?.map((breadcrumb: any, index: number) =>
        breadcrumb?.link &&
        (index !== breadCrumbs.length - 1 || isShowLastLink) ? (
          <Button
            key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
            variant="text"
            sx={{
              color: theme.palette.secondary.main,
            }}
            href={breadcrumb?.link}
            rel="noopener noreferrer"
          >
            <SpeakableText>
              {breadcrumb?.name ?? breadcrumb?.label ?? ''}
            </SpeakableText>
          </Button>
        ) : (
          <Typography
            key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
            variant="body1"
            color="text.secondary"
          >
            <SpeakableText>
              {breadcrumb?.name ?? breadcrumb?.label ?? ''}
            </SpeakableText>
          </Typography>
        )
      )}
      {(!breadCrumbs || breadCrumbs?.length === 0) &&
        ['Course', ...(topic ? [topic] : [])].map((key) => (
          <Typography key={key} variant="body1">
            <SpeakableText>{key}</SpeakableText>
          </Typography>
        ))}
    </Breadcrumbs>
  );
};

export default memo(BreadCrumb);
