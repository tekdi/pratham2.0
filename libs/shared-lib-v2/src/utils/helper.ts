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
