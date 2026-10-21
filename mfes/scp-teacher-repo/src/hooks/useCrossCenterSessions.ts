import { useEffect, useState } from 'react';
import {
  CrossCenterDateRange,
  CrossCenterSessionItem,
  loadCrossCenterSessions,
} from '@/utils/crossCenter';
import { shortDateFormat } from '@/utils/helper';

/**
 * Loads the cross-center sessions this facilitator can see, split into
 * Planned/Extra - shared by the Cross-Center Sessions list page and its
 * month-calendar view. Call `refresh()` after an edit/create/delete so both
 * stay in sync without duplicating the fetch/resolve logic.
 *
 * `range` limits the fetch to the days on screen; the month view passes the
 * displayed month so past days are covered too. Without it the default
 * upcoming-only (1-year) window applies.
 */
const useCrossCenterSessions = (range?: CrossCenterDateRange) => {
  const [loading, setLoading] = useState(true);
  const [extraSessions, setExtraSessions] = useState<CrossCenterSessionItem[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<CrossCenterSessionItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  // Callers build the range from a Date, so a fresh object arrives on every
  // render - the effect keys off the formatted days instead of the object
  // identity, otherwise it would refetch in a loop.
  const rangeStartKey = range?.startDate ? shortDateFormat(range.startDate) : '';
  const rangeEndKey = range?.endDate ? shortDateFormat(range.endDate) : '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId =
          typeof window !== 'undefined'
            ? localStorage.getItem('userId') || ''
            : '';
        setCurrentUserId(userId);
        // Edit access depends on the role as well as the creator, so the
        // session cards get it from here alongside the user id.
        setCurrentUserRole(
          typeof window !== 'undefined'
            ? localStorage.getItem('role') ||
                localStorage.getItem('roleName') ||
                ''
            : ''
        );
        const { extraSessions: extra, plannedSessions: planned } =
          await loadCrossCenterSessions(userId, range);
        setExtraSessions(extra);
        setPlannedSessions(planned);
      } catch (error) {
        console.error('Error loading cross-center sessions', error);
        setExtraSessions([]);
        setPlannedSessions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, rangeStartKey, rangeEndKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  return {
    loading,
    extraSessions,
    plannedSessions,
    currentUserId,
    currentUserRole,
    refresh,
  };
};

export default useCrossCenterSessions;
