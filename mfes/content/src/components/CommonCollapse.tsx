import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  SvgIcon,
} from '@mui/material';
import { useRouter } from 'next/navigation'; // Use Next.js router for navigation
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import HtmlIcon from '@mui/icons-material/IntegrationInstructions';
import LensIcon from '@mui/icons-material/Lens';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CircularProgressWithLabel, getLeafNodes } from '@shared-lib';

function EAlphabetIcon(props: any) {
  return (
    <SvgIcon
      style={{
        border: `1px solid ${props?.color || props?.sx?.color || '#999'}`,
        borderRadius: '8px',
      }}
      {...props}
    >
      <text
        style={{
          transform: 'rotate(-30deg)',
          transformOrigin: 'center',
        }}
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="20"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      >
        e
      </text>
    </SvgIcon>
  );
}
function H5P(props: any) {
  return (
    <SvgIcon
      style={{
        border: `1px solid ${props?.color || props?.sx?.color || '#999'}`,
        borderRadius: '8px',
        background: `${props?.color || props?.sx?.color || '#999'}`,
      }}
      {...props}
    >
      <text
        style={{
          transform: 'rotate(-30deg)',
          transformOrigin: 'center center',
          letterSpacing: -1,
          fontSize: '14px',
          color: 'white',
        }}
        x="50%"
        y="53%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="20"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      >
        H5P
      </text>
    </SvgIcon>
  );
}
// Types for nested data structure and actions
interface NestedItem {
  identifier: string;
  name: string;
  mimeType: string;
  children?: NestedItem[];
}

interface CommonAccordionProps {
  item: NestedItem;
  actions?: { label: string; onClick: () => void }[];
  TrackData?: any[];
}

const GetIconByMimeType = React.memo(function GetIconByMimeTypeComponent({
  mimeType,
  isShowText = false,
  _box,
}: {
  mimeType?: string;
  isShowText?: boolean;
  _box?: any;
}): React.ReactNode {
  const icons = {
    'application/pdf': {
      icon: <PictureAsPdfIcon sx={{ color: 'red' }} />,
      text: 'PDF',
    },
    'video/mp4': {
      icon: <PlayCircleIcon sx={{ color: 'blue' }} />,
      text: 'Video',
    },
    'video/webm': {
      icon: <PlayCircleIcon sx={{ color: 'blue' }} />,
      text: 'Video',
    },
    'video/x-youtube': {
      icon: <SmartDisplayIcon sx={{ color: 'red' }} />,
      text: 'Youtube',
    },
    'application/vnd.sunbird.questionset': {
      icon: <TextSnippetOutlinedIcon />,
      text: 'QUML',
    },
    'application/vnd.ekstep.h5p-archive': {
      icon: <H5P sx={{ color: '#2575be' }} />,
      text: 'H5P',
    },
    'application/vnd.ekstep.html-archive': {
      icon: <HtmlIcon sx={{ color: 'green' }} />,
      text: 'HTML',
    },
    'application/epub': {
      icon: <EAlphabetIcon sx={{ color: 'green' }} />,
      text: 'Epub',
    },
  };
  if (isShowText) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          ..._box,
        }}
      >
        {icons?.[mimeType as keyof typeof icons]?.icon || (
          <TextSnippetOutlinedIcon />
        )}
        <Typography>
          {icons?.[mimeType as keyof typeof icons]?.text || 'unknown'}
        </Typography>
      </Box>
    );
  }
  //@ts-ignore
  return (
    icons?.[mimeType as keyof typeof icons]?.icon || <TextSnippetOutlinedIcon />
  );
});

const RenderNestedData: React.FC<{
  data: NestedItem[];
  expandedItems: Set<string>;
  trackData?: any[];
  // toggleExpanded: (identifier: string) => void;
}> = React.memo(function RenderNestedData({
  data,
  expandedItems,
  // toggleExpanded,
  trackData,
}) {
  const router = useRouter();
  return data?.map((item) => {
    let progress = 0;
    // const isExpanded = expandedItems.has(item.identifier);
    const isUnit =
      item.mimeType === 'application/vnd.ekstep.content-collection';
    if (isUnit) {
      const leafNodes = getLeafNodes(item);
      const completedTrackData = trackData?.filter(
        (e: any) => leafNodes?.includes(e.courseId) && e.completed
      );
      const completedCount = completedTrackData?.length || 0;
      const percentage =
        leafNodes.length > 0
          ? Math.round((completedCount / leafNodes.length) * 100)
          : 0;
      progress = percentage;
    }
    const childrenCount = item.children?.length || 0;
    const newTrack = trackData?.find((e) => e?.courseId == item?.identifier);
    const handleItemClick = (identifier: string) => {
      localStorage.setItem('unitId', identifier);
      const path =
        childrenCount >= 1 &&
        item.mimeType === 'application/vnd.ekstep.content-collection'
          ? `/details/${identifier}`
          : `/player/${item.identifier}`;
      router.push(path);
    };

    return (
      <Stack
        key={item.identifier}
        sx={{
          borderBottom: '1px solid #ccc',
          borderRadius: '4px',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          cursor: 'pointer',
          gap: '16px',
        }}
        onClick={() => handleItemClick(item.identifier)}
      >
        <Stack sx={{ width: '100%' }}>
          <RowContent
            title={item.name}
            data={item.children || []}
            mimeType={item.mimeType}
            expandedItems={expandedItems}
            trackCompleted={newTrack?.completed ? 100 : 0}
            trackProgress={progress}
            showStatus={!isUnit}
            showProgress={isUnit}
            showUnits={isUnit}
          />
        </Stack>

        {/* {isExpanded && item.children?.length && (
          <Stack sx={{ marginTop: '8px', paddingLeft: '16px', width: '100%' }}>
            <RenderNestedData
              data={item.children}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
              trackData={trackData}
            />
          </Stack>
        )} */}
      </Stack>
    );
  });
});

RenderNestedData.displayName = 'RenderNestedData';

export const CommonCollapse: React.FC<CommonAccordionProps> = ({
  item,
  actions = [],
  TrackData,
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [trackCompleted, setTrackCompleted] = React.useState(0);
  const [trackProgress, setTrackProgress] = React.useState(0);

  React.useEffect(() => {
    const init = () => {
      try {
        //@ts-ignore
        if (TrackData) {
          const leafNodes = getLeafNodes(item);
          if (item?.children && item.children.length > 0) {
            const completedTrackData = TrackData.filter(
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
            const completedTrackData = TrackData.find(
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
  }, [TrackData, item]);

  const toggleExpanded = (identifier: string) => {
    setExpandedItems((prev) => {
      const newExpandedItems = new Set(prev);
      if (newExpandedItems.has(identifier)) {
        newExpandedItems.delete(identifier);
      } else {
        newExpandedItems.add(identifier);
      }
      return newExpandedItems;
    });
  };

  const handleItemClick = (identifier: string) => {
    const path = `/player/${identifier}`;
    router.push(path);
  };

  return (
    <>
      {item?.children && item.children.length > 0 ? (
        <AccordionWrapper
          item={item}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          trackProgress={trackProgress}
          trackCompleted={trackCompleted}
          trackData={TrackData ?? []}
        />
      ) : (
        <Stack
          sx={{
            borderBottom: '1px solid #ccc',
            borderRadius: '4px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer',
            gap: '16px',
            backgroundColor: '#fff',
          }}
          onClick={() => handleItemClick(item.identifier)}
        >
          <Stack sx={{ width: '100%' }}>
            <RowContent
              title={item?.name}
              data={item?.children || []}
              mimeType={item?.mimeType}
              expandedItems={expandedItems}
              trackCompleted={trackCompleted}
              showStatus
            />
          </Stack>
        </Stack>
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
    </>
  );
};

const CollapsebleGrid = React.memo(function CollapsebleGrid({
  data,
  trackData,
}: {
  data: any[];
  trackData: any[];
}) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data?.map((item: any) => (
    <CommonCollapse key={item.identifier} item={item} TrackData={trackData} />
  ));
});

export default CollapsebleGrid;

const AccordionWrapper = ({
  item,
  expandedItems,
  toggleExpanded,
  trackProgress,
  trackCompleted,
  trackData,
}: {
  item: NestedItem;
  expandedItems: Set<string>;
  toggleExpanded: (identifier: string) => void;
  trackProgress: number;
  trackCompleted: number;
  trackData: any[];
}) => {
  const theme = useTheme();

  return (
    <Accordion
      expanded={expandedItems.has(item?.identifier)}
      onChange={() => toggleExpanded(item?.identifier)}
    >
      <AccordionSummary
        sx={{
          backgroundColor: theme.palette.secondary.main,
        }}
        expandIcon={
          expandedItems.has(item?.identifier) ? (
            <ArrowDropDownIcon sx={{ fontSize: '2rem' }} />
          ) : (
            <ArrowDropUpIcon sx={{ fontSize: '2rem' }} />
          )
        }
      >
        <RowContent
          title={item?.name}
          data={item?.children || []}
          expandedItems={expandedItems}
          trackProgress={trackProgress}
          trackCompleted={trackCompleted}
          showProgress
        />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <RenderNestedData
          data={item?.children || []}
          expandedItems={expandedItems}
          // toggleExpanded={toggleExpanded}
          trackData={trackData}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const RowContent = ({
  title,
  data,
  mimeType,
  expandedItems,
  trackProgress,
  trackCompleted,
  showProgress = false,
  showStatus = false,
  showUnits = false,
}: {
  title: string;
  data: NestedItem[];
  expandedItems: Set<string>;
  mimeType?: string;
  trackProgress?: number;
  trackCompleted?: number;
  showProgress?: boolean;
  showStatus?: boolean;
  showUnits?: boolean;
}) => {
  return (
    <Stack
      width={'100%'}
      direction="row"
      justifyContent="space-between"
      alignItems={'center'}
    >
      <Stack direction="row" spacing={1} alignItems={'center'}>
        <StatusIcon
          showLenseIcon={expandedItems.has(data?.[0]?.identifier)}
          showMimeTypeIcon={showStatus && !data?.length}
          mimeType={mimeType}
        />
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>
        {Boolean(showUnits) && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              color: '#65558F',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {data.length} Units <ArrowForwardOutlinedIcon />
          </Typography>
        )}
      </Stack>
      {showProgress && (
        <CircularProgressWithLabel
          color2={'#e8d7b4'}
          value={trackProgress ?? 0}
          _text={{
            sx: {
              color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
            },
          }}
          sx={{
            color: trackCompleted === 100 ? '#21A400' : '#FFB74D',
          }}
        />
      )}
      {showStatus &&
        (trackCompleted === 100 ? (
          <CheckCircleIcon sx={{ color: '#21A400' }} />
        ) : (
          <ErrorIcon sx={{ color: '#FFB74D' }} />
        ))}
    </Stack>
  );
};

export const StatusIcon = React.memo(
  ({
    showMimeTypeIcon,
    showLenseIcon,
    mimeType,
    _icon,
  }: {
    showMimeTypeIcon?: boolean;
    showLenseIcon?: boolean;
    mimeType?: string;
    _icon?: any;
  }) => {
    if (showMimeTypeIcon) {
      return <GetIconByMimeType mimeType={mimeType} {..._icon} />;
    } else if (showLenseIcon) {
      return <LensIcon sx={{ fontSize: '1.5rem' }} />;
    }
    return <LensOutlinedIcon sx={{ fontSize: '1.5rem' }} />;
  }
);
StatusIcon.displayName = 'StatusIcon';
