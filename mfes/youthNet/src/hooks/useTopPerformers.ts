// Top Performers is fetched from the tracking/content/course/status API (type: "topperformer")
// for a manager-selected date range, independently of the shared course learning summary used by
// the rest of the Manager Dashboard — so it gets its own loading/error state and its own hook.
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { fetchTopPerformerCertificates } from '../services/TrackingService';
import { ManagerTeamUser, TopPerformer } from '../utils/Interface';
import { buildUserById, getUserDisplayName } from '../utils/managerDashboardHelpers';

const DEFAULT_TO_DATE = dayjs();
const DEFAULT_FROM_DATE = DEFAULT_TO_DATE.subtract(1, 'month');

export interface UseTopPerformersResult {
  performers: TopPerformer[];
  loading: boolean;
  error: boolean;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  setFromDate: (date: Dayjs | null) => void;
  setToDate: (date: Dayjs | null) => void;
}

export const useTopPerformers = (users: ManagerTeamUser[], limit = 5): UseTopPerformersResult => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(DEFAULT_FROM_DATE);
  const [toDate, setToDate] = useState<Dayjs | null>(DEFAULT_TO_DATE);
  const [performers, setPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const userIds = users.map((user) => user.userId).filter(Boolean);
  const userIdsKey = userIds.join(',');

  useEffect(() => {
    if (userIds.length === 0 || !fromDate || !toDate) {
      setPerformers([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchTopPerformerCertificates({
      userId: userIds,
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    })
      .then((entries) => {
        if (cancelled) return;
        const userById = buildUserById(users);
        const ranked = entries
          .map((entry) => ({
            userId: entry.userId,
            userName: getUserDisplayName(userById[entry.userId], entry.userId),
            certificateCount: entry.certificates?.length ?? 0,
          }))
          .filter((performer) => performer.certificateCount > 0)
          .sort(
            (a, b) => b.certificateCount - a.certificateCount || a.userName.localeCompare(b.userName)
          )
          .slice(0, limit);
        setPerformers(ranked);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error fetching top performers:', err);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdsKey, fromDate, toDate, limit]);

  return { performers, loading, error, fromDate, toDate, setFromDate, setToDate };
};
