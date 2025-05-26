export interface trackDataPorps {
  courseId: string;
  status: string;
  percentage: string | number;
  completed: number;
  completed_list: string[];
  in_progress: number;
  in_progress_list: string[];
}
export function calculateCourseStatus({
  statusData,
  allCourseIds,
  courseId,
}: {
  statusData: { completed_list: string[]; in_progress_list: string[] };
  allCourseIds: string[];
  courseId: string;
}): trackDataPorps {
  const completedList = new Set(statusData.completed_list || []);
  const inProgressList = new Set(statusData.in_progress_list || []);

  let completedCount = 0;
  let inProgressCount = 0;
  const completed_list: string[] = [];
  const in_progress_list: string[] = [];

  for (const id of allCourseIds) {
    if (completedList.has(id)) {
      completedCount++;
      completed_list.push(id);
    } else if (inProgressList.has(id)) {
      inProgressCount++;
      in_progress_list.push(id);
    }
  }

  const total = allCourseIds.length;
  let status = 'not started';

  if (completedCount === total && total > 0) {
    status = 'completed';
  } else if (completedCount > 0 || inProgressCount > 0) {
    status = 'in progress';
  }

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completed_list,
    in_progress_list,
    completed: completedCount,
    in_progress: inProgressCount,
    courseId,
    status,
    percentage: percentage,
  };
}

export const calculateTrackData = (newTrack: any, children: any) => {
  const newTrackData = children?.map((item: any) => {
    return calculateTrackDataItem(newTrack, item);
  });
  return newTrackData;
};

export const calculateTrackDataItem = (newTrack: any, item: any) => {
  if (item?.mimeType === 'application/vnd.ekstep.content-collection') {
    const result = calculateCourseStatus({
      statusData: newTrack,
      allCourseIds: item?.leafNodes ?? [],
      courseId: item.identifier,
    });
    return result;
  } else {
    const result = calculateCourseStatus({
      statusData: newTrack,
      allCourseIds: item.identifier ? [item.identifier] : [],
      courseId: item.identifier,
    });
    return result;
  }
};

type KeyFormat = string | { key: string; format?: string; suffix: string };

export function findCourseUnitPath(
  node: any,
  targetId: string,
  keyArray: KeyFormat[],
  path: any[] = []
): any[] | null {
  // Build current node's object by processing keyArray
  const currentObj = keyArray.reduce((acc, keyItem) => {
    if (typeof keyItem === 'string') {
      // simple key, just pick the value if exists
      if (node[keyItem] !== undefined) acc[keyItem] = node[keyItem];
    } else if (typeof keyItem === 'object' && keyItem.key) {
      let formattedValue = '';
      if (keyItem.key === 'link') {
        if (
          path?.length > 0 &&
          node.mimeType === 'application/vnd.ekstep.content-collection'
        ) {
          formattedValue = `/content/${path?.[0]?.identifier}/${
            node.identifier
          }${keyItem?.suffix ?? ''}`;
        } else {
          formattedValue = `/content/${node.identifier}${
            keyItem?.suffix ?? ''
          }`;
        }
      }
      if (keyItem.format) {
        // Replace ${id} or any ${key} in format with node[key]
        formattedValue = keyItem.format.replace(
          /\$\{(\w+)\}/g,
          (_, k) => node[k] ?? ''
        );
      }
      acc[keyItem.key] = formattedValue;
    }
    return acc;
  }, {} as Record<string, any>);

  const newPath = [...path, currentObj];

  if (node.identifier === targetId) {
    return newPath;
  }

  const children = node.children;

  if (Array.isArray(children)) {
    for (const child of children) {
      const result = findCourseUnitPath(child, targetId, keyArray, newPath);
      if (result) return result;
    }
  }

  return null;
}
