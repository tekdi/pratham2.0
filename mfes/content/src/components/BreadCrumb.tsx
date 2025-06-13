import React, { memo } from 'react';
import {
  Breadcrumbs,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { useRouter } from 'next/navigation';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const handleClick = (link: string) => {
    router.replace(link);
  };

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadCrumbs?.map((breadcrumb: any, index: number) => {
        return breadcrumb?.link &&
          (index !== breadCrumbs.length - 1 || isShowLastLink)
          ? ((isMobile &&
              index === breadCrumbs.length - (isShowLastLink ? 1 : 2)) ||
              !isMobile) && (
              <Button
                key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
                variant="text"
                sx={{
                  color: theme.palette.secondary.main,
                }}
                onClick={() => handleClick(breadcrumb?.link)}
              >
                <SpeakableText>
                  {breadcrumb?.name ?? breadcrumb?.label ?? ''}
                </SpeakableText>
              </Button>
            )
          : !isMobile && (
              <Typography
                key={`${breadcrumb?.name ?? breadcrumb?.label ?? ''} ${index}`}
                variant="body1"
                color="text.secondary"
              >
                <SpeakableText>
                  {breadcrumb?.name ?? breadcrumb?.label ?? ''}
                </SpeakableText>
              </Typography>
            );
      })}
      {(!breadCrumbs || breadCrumbs?.length === 0) &&
        [...(topic ? ['Course', topic] : [])].map((key) => (
          <Typography key={key} variant="body1">
            <SpeakableText>{key}</SpeakableText>
          </Typography>
        ))}
    </Breadcrumbs>
  );
};

export default memo(BreadCrumb);
