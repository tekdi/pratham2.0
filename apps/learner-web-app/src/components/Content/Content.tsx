'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FetchDoIds, getTenantInfo } from '@learner/utils/API/ProgramService';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const ContentComponent = ({ limit }: any) => {
  const [identifier, setIdentifier] = useState([]);

  useEffect(() => {
    const fetchDOIds = async () => {
      try {
        const userId = [localStorage.getItem('userId')];
        if (userId && userId[0] !== null) {
          const res = await FetchDoIds(userId);

          const courseIdList = res?.data[0]?.courseIdList;
          const courseIds = courseIdList.map((course: any) => course.courseId);
          setIdentifier(courseIds);
        }
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };

    fetchDOIds();
  }, []);
  // console.log(courseIds);
  return (
    <Content
      isShowLayout={false}
      contentTabs={['Course']}
      showFilter={false}
      showSearch={false}
      showHelpDesk={false}
      filters={{
        limit: limit,
        filters: {
          identifier: identifier,
        },
      }}
      hasMoreData={false}
      _config={{
        default_img: '/images/image_ver.png',
        _card: { isHideProgress: true },
      }}
    />
  );
};

export default ContentComponent;
