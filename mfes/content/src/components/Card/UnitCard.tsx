import { CommonCard, ContentItem } from '@shared-lib';
import { Box } from '@mui/material';
import AppConst from '../../utils/AppConst/AppConst';

const UnitCard = ({
  item,
  trackData,
  type,
  _card,
  default_img,
  handleCardClick,
}: {
  item: ContentItem;
  trackData: any[];
  type?: any;
  _card?: any;
  default_img?: string;
  handleCardClick: (content: ContentItem) => void;
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        mt: '18px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -12,
          zIndex: 0,
          width: _card?.sx?.width ?? '100%',
          px: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#6D6D70',
            height: '32px',
            borderRadius: '10px',
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -6,
          zIndex: 0,
          width: _card?.sx?.width ?? '100%',
          px: 1.5,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#bebec0',
            height: '32px',
            borderRadius: '10px',
          }}
        />
      </Box>
      <Box sx={{ zIndex: 1, width: _card?.sx?.width ?? '100%' }}>
        <CommonCard
          minheight="100%"
          title={(item?.name || '').trim()}
          image={
            item?.posterImage
              ? item?.posterImage
              : default_img ??
                `${AppConst.BASEPATH}/assests/images/image_ver.png`
          }
          content={
            item?.description ? item?.description : 'No description available'
          }
          orientation="horizontal"
          item={item}
          TrackData={trackData}
          type={type}
          onClick={() => handleCardClick(item)}
          _card={{
            _contentText: {
              sx: !item?.description
                ? {
                    color: '#79747E',
                    fontStyle: 'italic',
                    minHeight: '114px',
                  }
                : {
                    textTransform: 'capitalize',
                    minHeight: '114px',
                  },
            },
            ..._card,
          }}
        />
      </Box>
    </Box>
  );
};

export default UnitCard;
