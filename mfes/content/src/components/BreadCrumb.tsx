import React, { memo } from 'react';
import { Breadcrumbs, Button, Typography, useTheme } from '@mui/material';

const BreadCrumb = ({
  breadCrumbs,
  topic,
}: {
  breadCrumbs: any;
  topic?: string;
}) => {
  const theme = useTheme();

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadCrumbs?.map((breadcrumb: any, index: number) =>
        breadcrumb?.link && index !== breadCrumbs.length - 1 ? (
          <Button
            key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
            variant="text"
            sx={{
              color: theme.palette.primary.main,
            }}
            href={breadcrumb?.link}
            rel="noopener noreferrer"
          >
            {breadcrumb?.name ?? breadcrumb?.label ?? ''}
          </Button>
        ) : (
          <Typography
            key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
            variant="body1"
            color="text.secondary"
          >
            {breadcrumb?.name ?? breadcrumb?.label ?? ''}
          </Typography>
        )
      )}
      {(!breadCrumbs || breadCrumbs?.length === 0) &&
        ['Course', ...(topic ? [topic] : [])].map((key) => (
          <Typography key={key} variant="body1">
            {key}
          </Typography>
        ))}
    </Breadcrumbs>
  );
};

export default memo(BreadCrumb);
