'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from '@shared-lib';
import { RecommendedContentItem } from '@learner/utils/Interface';

const RecommendedContentCard = ({
  item,
  onOpen,
}: {
  item: RecommendedContentItem;
  onOpen: (identifier: string) => void;
}) => {
  const { t } = useTranslation();
  const explanationRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const metaText = [item?.language, item?.format, item?.subject]
    .filter(Boolean)
    .join(' · ');

  useEffect(() => {
    const el = explanationRef.current;
    if (!el) return;
    setShowToggle(el.scrollHeight > el.clientHeight + 1);
  }, [item?.explanation]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12)',
        p: 2,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box
          sx={{
            flexShrink: 0,
            width: 48,
            height: 48,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'customColors.secondary300',
            backgroundImage: item?.posterImage
              ? `url(${item.posterImage})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component="h3"
            sx={{
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 600,
              color: 'text.primary',
              m: 0,
            }}
          >
            {item?.name}
          </Typography>
          {metaText && (
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 400,
                color: 'text.secondary',
                mt: 0.25,
              }}
            >
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
            mt: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              lineHeight: '18px',
              fontWeight: 600,
              mb: 0.5,
              color: 'text.primary',
            }}
          >
            {`\u{1F4A1} ${t('LEARNER_APP.PLAYER.RECOMMENDED_BECAUSE')}`}
          </Typography>
          <Typography
            ref={explanationRef}
            sx={{
              fontSize: '13px',
              lineHeight: '18px',
              fontWeight: 400,
              color: 'text.primary',
              ...(!isExpanded && {
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
            }}
          >
            {item.explanation}
          </Typography>
          {showToggle && (
            <Typography
              component="button"
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              sx={{
                fontSize: '13px',
                lineHeight: '18px',
                mt: 0.5,
                p: 0,
                border: 0,
                background: 'none',
                color: 'secondary.main',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isExpanded ? t('COMMON.READ_LESS') : t('COMMON.READ_MORE')}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Typography
          component="button"
          type="button"
          onClick={() => onOpen(item.identifier)}
          sx={{
            fontSize: '13px',
            lineHeight: '18px',
            p: 0,
            border: 0,
            background: 'none',
            color: 'secondary.main',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {`${t('LEARNER_APP.PLAYER.OPEN')} →`}
        </Typography>
      </Box>
    </Box>
  );
};

export default RecommendedContentCard;
