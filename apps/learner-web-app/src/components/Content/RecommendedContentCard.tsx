'use client';
import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { ExpandableText, useTranslation } from '@shared-lib';
import { RecommendedContentItem } from '@learner/utils/Interface';

const RecommendedContentCard = ({
  item,
  onOpen,
}: {
  item: RecommendedContentItem;
  onOpen: (identifier: string) => void;
}) => {
  const { t } = useTranslation();

  const metaText = [item?.language, item?.format, item?.subject]
    .filter(Boolean)
    .join(' · ');

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'customColors.secondary400',
        borderRadius: '12px',
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar
          variant="rounded"
          src={item?.posterImage}
          alt={item?.name}
          sx={{ width: 56, height: 56 }}
        >
          {item?.name?.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body4"
            component="h3"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {item?.name}
          </Typography>
          {metaText && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {metaText}
            </Typography>
          )}
        </Box>
      </Box>

      {item?.explanation && (
        <Box
          sx={{
            backgroundColor: 'customColors.recommendationCardBackground',
            border: '1px solid',
            borderColor: 'customColors.recommendationCardBorder',
            borderRadius: '8px',
            p: 1.5,
          }}
        >
          <Typography
            variant="body3"
            sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}
          >
            {`\u{1F4A1} ${t('LEARNER_APP.PLAYER.RECOMMENDED_BECAUSE')}`}
          </Typography>
          <ExpandableText
            text={item.explanation}
            maxWords={1000}
            maxLines={3}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => onOpen(item.identifier)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {`${t('LEARNER_APP.PLAYER.OPEN')} →`}
        </Button>
      </Box>
    </Box>
  );
};

export default RecommendedContentCard;
