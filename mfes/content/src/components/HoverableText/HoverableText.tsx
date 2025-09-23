import React from 'react';
import { Typography, TypographyProps, Tooltip } from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';

interface HoverableTextProps {
  name: string;
  maxLines?: number;
  variant?: TypographyProps['variant'] | string;
  component?: React.ElementType;
  sx?: TypographyProps['sx'];
  fontWeight?: number | string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  disableTooltip?: boolean;
}

const HoverableText: React.FC<HoverableTextProps> = ({
  name,
  maxLines = 2,
  variant = 'body8',
  component = 'div',
  sx = {},
  fontWeight = 700,
  textTransform = 'capitalize',
  disableTooltip = false,
}) => {
  const truncatedTextElement = (
    <Typography
      component={component}
      // @ts-ignore - Custom variant handling
      variant={variant}
      sx={{
        fontWeight,
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform,
        cursor: 'default',
        ...sx,
      }}
    >
      <SpeakableText>{name}</SpeakableText>
    </Typography>
  );

  if (disableTooltip || !name) {
    return truncatedTextElement;
  }

  return (
    <Tooltip 
      title={name} 
      arrow
      enterDelay={300}
      leaveDelay={0}
      enterTouchDelay={0}
      leaveTouchDelay={1500}
      sx={{
        '& .MuiTooltip-tooltip': {
          maxWidth: '300px',
          fontSize: '14px',
          lineHeight: 1.4,
          backgroundColor: 'rgba(97, 97, 97, 0.95)',
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      {truncatedTextElement}
    </Tooltip>
  );
};

export default React.memo(HoverableText); 