import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation'; // Use Next.js router for navigation
import { ContentItem, getLeafNodes } from '@shared-lib';
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
  const router = useRouter();
  const { default_img, _card, _grid } = _config || {};
  const [trackCompleted, setTrackCompleted] = React.useState(0);
  const [trackProgress, setTrackProgress] = React.useState(0);

  React.useEffect(() => {
    const init = () => {
      try {
        //@ts-ignore
        if (trackData) {
          const leafNodes = getLeafNodes(item);
          if (item?.children && item.children.length > 0) {
            const completedTrackData = trackData.filter(
              (e: any) => e.courseId !== item.identifier && e.completed
            );
            setTrackCompleted(
              completedTrackData?.length === leafNodes?.length ? 100 : 0
            );
            const completedCount = completedTrackData?.length || 0;
            const percentage =
              leafNodes.length > 0
                ? Math.round((completedCount / leafNodes.length) * 100)
                : 0;
            setTrackProgress(percentage);
          } else {
            const completedTrackData = trackData.find(
              (e: any) => e.courseId === item.identifier
            );
            setTrackCompleted(completedTrackData?.completed ? 100 : 0);
          }
        }
      } catch (e) {
        console.log('error', e);
      }
    };
    init();
  }, [trackData, item]);

  return (
    <Grid container spacing={2}>
      {item?.children?.map((subItem: any) => (
        <Grid
          key={subItem?.identifier}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          {..._grid}
        >
          {subItem?.children && subItem.children.length > 0 ? (
            <UnitCard
              item={subItem}
              trackData={trackData ?? []}
              default_img={default_img}
              _card={_card}
              handleCardClick={(content: ContentItem) =>
                handleItemClick(content)
              }
            />
          ) : (
            <ContentCard
              item={subItem}
              type={item.mimeType}
              default_img={default_img}
              _card={_card}
              handleCardClick={(content: ContentItem) =>
                handleItemClick(content)
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
