import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { ContentItem, getUnitCardHref, useTranslation } from '@shared-lib';
import UnitCard from './Card/UnitCard';
import ContentCard from './Card/ContentCard';

interface CommonAccordionProps {
  item: ContentItem;
  skipContentId?: string;
  actions?: { label: string; onClick: () => void }[];
  trackData?: any[];
  _config: any;
  handleItemClick?: (content: ContentItem) => void;
}

export const UnitGrid: React.FC<CommonAccordionProps> = ({
  item,
  skipContentId,
  actions = [],
  trackData,
  _config,
  handleItemClick,
}) => {
  const {
    default_img,
    _grid,
    _parentGrid,
    _card,
    _containerGrid,
    courseId,
    effectiveUnitId,
    contentBaseUrl,
    activeLink,
    enableCardHref,
  } = _config || {};
  const { t } = useTranslation();

  const buildUnitCardHref = (subItem: ContentItem) => {
    if (enableCardHref === false) return undefined;
    // Manual assessment cards: build /manual-assessment URL to match onClick behavior
    if ((subItem as any).evaluationType === 'offline') {
      const userId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') ?? '' : '';
      const returnUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : '';
      const params = new URLSearchParams({
        assessmentId: subItem.identifier ?? '',
        userId,
        parentId: courseId ?? '',
      });
      if (returnUrl) params.set('returnUrl', returnUrl);
      return `/manual-assessment?${params.toString()}`;
    }
    return getUnitCardHref(subItem, {
      courseId,
      effectiveUnitId,
      contentBaseUrl: contentBaseUrl ?? '/content',
      activeLink,
    });
  };

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 1, md: 2 }}
      {..._containerGrid}
      {..._parentGrid}
    >
      {item?.children?.length <= 0 ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
            {t('LEARNER_APP.CONTENT_TABS.NO_MORE_DATA')}
          </Typography>
        </Grid>
      ) : (
        item?.children
          ?.filter((subItem: any) => subItem.identifier !== skipContentId)
          ?.map((subItem: any) => {
            const unitHref = buildUnitCardHref(subItem);
            return (
              <Grid
                key={subItem?.identifier}
                item
                xs={6}
                sm={4}
                md={3}
                lg={2.4}
                xl={2}
                {..._grid}
              >
                {subItem?.mimeType ===
                'application/vnd.ekstep.content-collection' ? (
                  <UnitCard
                    item={subItem}
                    trackData={trackData ?? []}
                    default_img={default_img}
                    _card={{
                      ..._card,
                      href: unitHref,
                      sx: { ...(_card?.sx ?? {}), height: '100%' },
                    }}
                    handleCardClick={(content: ContentItem) =>
                      handleItemClick?.(content)
                    }
                  />
                ) : (
                  <ContentCard
                    item={subItem}
                    type={item.mimeType}
                    default_img={default_img}
                    _card={{
                      ..._card,
                      // Unit/lesson href — same paths as CourseUnitDetails.handleItemClick.
                      href: unitHref,
                      // When getUnitCardHref returns undefined (e.g. evaluationType=offline),
                      // prevent ContentCard's getContentCardHref fallback which ignores evaluationType.
                      ...(unitHref === undefined && { enableCardHref: false }),
                      sx: { ...(_card?.sx ?? {}), height: '100%' },
                    }}
                    handleCardClick={(content: ContentItem) =>
                      handleItemClick?.(content)
                    }
                    trackData={trackData as []}
                  />
                )}

                {actions.length > 0 && (
                  <Box sx={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    {actions.map((action) => (
                      <Button
                        key={action.label}
                        onClick={action.onClick}
                        variant="contained"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Grid>
            );
          })
      )}
    </Grid>
  );
};

export default UnitGrid;
