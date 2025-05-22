import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { ContentItem, useTranslation } from '@shared-lib';
import UnitCard from './Card/UnitCard';
import ContentCard from './Card/ContentCard';

interface CommonAccordionProps {
  item: ContentItem;
  actions?: { label: string; onClick: () => void }[];
  trackData?: any[];
  _config: any;
  handleItemClick?: (content: ContentItem) => void;
}

export const UnitGrid: React.FC<CommonAccordionProps> = ({
  item,
  actions = [],
  trackData,
  _config,
  handleItemClick,
}) => {
  const { default_img, _grid, _card } = _config || {};
  const { t } = useTranslation();

  return (
    <Grid container spacing={{ xs: 1, sm: 1, md: 2 }}>
      {item?.children?.length <= 0 ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
            {t('LEARNER_APP.CONTENT_TABS.NO_MORE_DATA')}
          </Typography>
        </Grid>
      ) : (
        item?.children?.map((subItem: any) => (
          <Grid
            key={subItem?.identifier}
            item
            xs={6}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            {..._grid}
          >
            {subItem?.mimeType ===
            'application/vnd.ekstep.content-collection' ? (
              <UnitCard
                item={subItem}
                trackData={trackData ?? []}
                default_img={default_img}
                _card={_card}
                handleCardClick={(content: ContentItem) =>
                  handleItemClick?.(content)
                }
              />
            ) : (
              <ContentCard
                item={subItem}
                type={item.mimeType}
                default_img={default_img}
                _card={_card}
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
        ))
      )}
    </Grid>
  );
};

export default UnitGrid;
