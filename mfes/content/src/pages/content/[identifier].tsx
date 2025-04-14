// pages/content/[identifier].tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { Circular } from '@shared-lib';
import { hierarchyAPI } from '../../services/Hierarchy';

interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
}

export default function Content() {
  const router = useRouter();
  const { identifier } = router.query; // Access dynamic parameter 'identifier'
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await hierarchyAPI(identifier as string);
      //@ts-ignore
      if (result) setContentData([result]);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    if (identifier) fetchContent();
  }, [identifier]);

  if (isLoading) return <Circular />;
  if (!contentData.length) return <div>No Content Found</div>;

  return (
    <Box>
      {contentData.map((item) => (
        <div key={item?.identifier}>
          <h2>{item?.name}</h2>
          <p>{item?.gradeLevel?.join(', ')}</p>
        </div>
      ))}
    </Box>
  );
}
