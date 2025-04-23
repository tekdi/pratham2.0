import { Box } from '@mui/material';
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
  return (
    <CommonCard
      minheight="100%"
      title={(item?.name || '').trim()}
      image={
        item?.posterImage && item?.posterImage !== 'undefined'
          ? item?.posterImage
          : default_img ?? `${AppConst.BASEPATH}/assests/images/image_ver.png`
      }
      content={item?.description || ''}
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
      _card={_card}
    />
  );
};

export default ContentCard;
