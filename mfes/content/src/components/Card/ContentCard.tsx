import { Box, CSSObject, useTheme } from '@mui/material';
import { CommonCard, ContentItem } from '@shared-lib';
import AppConst from '../../utils/AppConst/AppConst';
import { StatusIcon } from '../CommonCollapse';

const ContentCard = ({
  item,
  type,
  default_img,
  _card,
  handleCardClick,
  trackData,
}: {
  item: ContentItem;
  type: any;
  default_img?: string;
  _card?: any;
  handleCardClick: (content: ContentItem) => void;
  trackData?: [];
}) => {
  const { isWrap } = _card ?? {};
  console.log(type, 'sagar item');
  return (
    <CardWrap isWrap={isWrap}>
      <CommonCard
        minheight="100%"
        title={(item?.name || '').trim()}
        image={
          item?.posterImage && item?.posterImage !== 'undefined'
            ? item?.posterImage
            : default_img ?? `${AppConst.BASEPATH}/assests/images/image_ver.png`
        }
        content={
          item?.description
            ? item?.description
            : type?.toLowerCase() === 'course'
            ? 'No description available'
            : ''
        }
        actions={
          type !== 'Course' && (
            <Box>
              <StatusIcon
                showMimeTypeIcon
                mimeType={item?.mimeType}
                _icon={{
                  isShowText: true,
                  _box: {
                    py: '7px',
                    px: '10px',
                    borderRadius: '10px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: '#79747E',
                  },
                }}
              />
            </Box>
          )
        }
        orientation="horizontal"
        item={item}
        TrackData={trackData}
        type={type}
        onClick={() => handleCardClick(item)}
        _card={{
          _contentText: {
            sx: { color: item?.description ? 'inherit' : '#79747E' },
          },
          ..._card,
        }}
      />
    </CardWrap>
  );
};

export default ContentCard;

const CardWrap = ({
  children,
  isWrap,
}: {
  children: React.ReactNode;
  isWrap?: boolean;
}) => {
  const theme = useTheme();
  const borderRadius = (
    theme?.components?.MuiCard?.styleOverrides?.root as CSSObject
  )?.borderRadius;
  if (!isWrap) {
    return children;
  }
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
          top: -8,
          zIndex: 0,
          width: '100%',
          px: 2,
        }}
      >
        <Box
          sx={{
            border: '1px solid #fff',
            boxShadow: '2px 0px 6px 2px #00000026, 1px 0px 2px 0px #0000004D',
            backgroundColor: '#DED8E1',
            height: '32px',
            borderRadius: borderRadius,
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -4,
          zIndex: 0,
          width: '100%',
          px: 1,
        }}
      >
        <Box
          sx={{
            border: '1px solid #fff',
            boxShadow: '2px 0px 6px 2px #00000026, 1px 0px 2px 0px #0000004D',
            backgroundColor: '#DED8E1',
            height: '32px',
            borderRadius: borderRadius,
          }}
        />
      </Box>
      <Box sx={{ zIndex: 1, width: '100%' }}>{children}</Box>
    </Box>
  );
};
