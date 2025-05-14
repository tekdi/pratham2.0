import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { ContentItem } from '@shared-lib';
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
  const { default_img, _card } = _config || {};

  return (
    <Grid container spacing={4}>
      {item?.children?.map((subItem: any) => (
        <Grid key={subItem?.identifier} item sx={{ flexWrap: 'wrap' }}>
          {subItem?.mimeType === 'application/vnd.ekstep.content-collection' ? (
            <UnitCard
              item={subItem}
              trackData={trackData ?? []}
              default_img={default_img}
              _card={{
                ..._card,
                sx: { width: '230px', ...(_card?.sx ?? {}) },
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
                sx: { width: '230px', ...(_card?.sx ?? {}) },
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
      ))}
    </Grid>
  );
};

export default UnitGrid;
