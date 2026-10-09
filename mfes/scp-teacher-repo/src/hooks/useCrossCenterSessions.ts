import { useEffect, useState } from 'react';
import { CrossCenterSessionItem, loadCrossCenterSessions } from '@/utils/crossCenter';

/**
 * Loads every cross-center session this facilitator can see (1-year window,
 * split into Planned/Extra) - shared by the Cross-Center Sessions list page
 * and its month-calendar view. Call `refresh()` after an edit/create/delete
 * so both stay in sync without duplicating the fetch/resolve logic.
 */
const useCrossCenterSessions = () => {
  const [loading, setLoading] = useState(true);
  const [extraSessions, setExtraSessions] = useState<CrossCenterSessionItem[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<CrossCenterSessionItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId =
          typeof window !== 'undefined'
            ? localStorage.getItem('userId') || ''
            : '';
        setCurrentUserId(userId);
        const { extraSessions: extra, plannedSessions: planned } =
          await loadCrossCenterSessions(userId);
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
  }, [refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  return { loading, extraSessions, plannedSessions, currentUserId, refresh };
};

export default useCrossCenterSessions;
