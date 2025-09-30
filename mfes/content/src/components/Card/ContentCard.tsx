import { Box, CSSObject, useTheme } from '@mui/material';
import { CommonCard, ContentItem } from '@shared-lib';
import AppConst from '../../utils/AppConst/AppConst';
import { StatusIcon } from '../CommonCollapse';
import Description from './Description';
// Array of default images from courseDefaultImages folder
const courseDefaultImages = [
  'Plastic_Literacy__202010271637124816.png',
  'Hickory_Dickory.png',
  'Science_202010131204476645.png',
  'Thumbnail_1_202405270759453576.png',
  'hn_meribilli.png',
  'बलगत_हद_Thumbnail.png',
  'hi_Ek_thi_Kamala_Title.png',
  'ENGINE_ENGINE.png',
  'DSC_2387_202007031404597526.jpg',
  'Electrical_Level_2_202009221151328179.png',
  'gas_cuttingPOS-01_202204120101419308_202503030400408351.png',
  'Food__Beverage_Service_Thumbnail.png',
  'Intervew-2_202204061102557202.jpg',
  'electrical_arc_welding_POS_202204120059399830_202503030359185963.png',
  'Electric_level_1_202009221150594061.png',
  'Housekeeping_Thumbnail.png',
  'Food_Production_Thumbnail.png',
  'Assistant_Electrician.png'
];

// Simple hash function to convert string to number
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Function to get consistent random default image based on identifier
const getRandomDefaultImage = (identifier: string) => {
  const hash = hashString(identifier);
  const index = hash % courseDefaultImages.length;
  return `/images/courseDefaultImages/${courseDefaultImages[index]}`;
};

// Function to get default image based on conditions
const getDefaultImage = (default_img?: string, identifier?: string) => {
  if (typeof window !== 'undefined') {
    const userProgram = localStorage.getItem('userProgram');
    
    if (userProgram === 'Open School' && identifier) {
      return getRandomDefaultImage(identifier);
    }
  }
  
  return default_img ?? `${AppConst.BASEPATH}/assests/images/image_ver.png`;
};

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
  handleCardClick: (content: ContentItem, e?: any) => void;
  trackData?: [];
}) => {
  const { isWrap } = _card ?? {};

  if (_card?.cardComponent) {
    return (
      <CardWrap
        // isWrap={isWrap && type === 'Course'}
        _card={_card}

        isWrap={false}>
        <_card.cardComponent
          item={item}
          type={type}
          default_img={default_img}
          _card={_card}
          handleCardClick={handleCardClick}
          trackData={trackData}
        />
      </CardWrap>
    );
  }
  console.log('ContentCard: No cardComponent found in _card', item);
  return (
    <CardWrap
      // isWrap={isWrap && type === 'Course'} 

      _card={_card} isWrap={false}>
      <CommonCard
        title={(item?.name || '').trim()}
        courseType={item?.courseType}
        image={
  item?.posterImage
    ? item.posterImage
    : item?.appIcon
      ? item.appIcon
      : getDefaultImage(default_img, item?.identifier || item?.name)
}
        content={item?.description ? item?.description : <Description />}
        actions={
          type !== 'Course' || type!=='Job family' || type!=='PSU' || type!=='Group Membership' && (
            <StatusIcon
              showMimeTypeIcon
              mimeType={item?.mimeType}
              _icon={{
                isShowText: true,
                _box: {
                  py: '7px',
                  px: '8px',
                  borderRadius: '10px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#79747E',
                },
              }}
            />
          )
        }
        orientation="horizontal"
        item={item}
        TrackData={trackData}
        type={type}
        onClick={(e: any) => handleCardClick(item, e)}
        _card={{
          _contentParentText: {
            sx: { height: type !== 'Course' ? '156px' : '172px' },
          },
          ..._card,
        }}
      />
    </CardWrap>
  );
};

export default ContentCard;

export const CardWrap = ({
  children,
  isWrap,
  _card,
}: {
  children: React.ReactNode;
  isWrap?: boolean;
  _card?: any;
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
        mt: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          zIndex: 0,
          width: _card?.sx?.width ?? '100%',
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
          width: _card?.sx?.width ?? '100%',
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
      <Box sx={{ zIndex: 1, width: _card?.sx?.width ?? '100%' }}>
        {children}
      </Box>
    </Box>
  );
};
