'use client';
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { Box, Typography, Button } from '@mui/material';

type ExpandableTextProps = {
  text?: string;
  number?: number;
};

export const ExpandableText: React.FC<ExpandableTextProps> = memo(
  ({ text = '', number = 2 }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [maxHeight, setMaxHeight] = useState<string>('0px');

    const lineHeight = 25.5; // Customize based on your actual line height

    // Toggle expand/collapse
    const toggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    // Detect overflow and set initial max height
    useEffect(() => {
      const el = contentRef.current;
      if (el) {
        const lineHeightPx = number * lineHeight;
        const fullHeight = el.scrollHeight;
        setMaxHeight(isExpanded ? `${fullHeight}px` : `${lineHeightPx}px`);
        setShowButton(fullHeight > lineHeightPx);
      }
    }, [text, number, isExpanded]);

    // Adjust height on expand/collapse
    useEffect(() => {
      const el = contentRef.current;
      if (el) {
        const fullHeight = el.scrollHeight;
        const lineHeightPx = number * lineHeight;
        const newHeight = isExpanded ? `${fullHeight}px` : `${lineHeightPx}px`;
        setMaxHeight(newHeight);
      }
    }, [isExpanded, number]);

    return (
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={contentRef}
          sx={{
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out',
            maxHeight,
          }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              textTransform: 'capitalize',
              color: '#1F1B13',
              whiteSpace: 'pre-wrap',
              lineHeight: `${lineHeight}px`,
            }}
          >
            {text}
          </Typography>
        </Box>

        {showButton && (
          <Button
            onClick={toggleExpand}
            sx={{
              textTransform: 'none',
              color: '#1F1B13',
              p: 0,
              minWidth: 'auto',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
              position: 'absolute',
              right: '-45px',
              bottom: '-2px',
            }}
          >
            {isExpanded ? '..less' : '..more'}
          </Button>
        )}
      </Box>
    );
  }
);
