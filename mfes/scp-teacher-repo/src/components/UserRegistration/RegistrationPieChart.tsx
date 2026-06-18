import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { fetchUserList } from '../../services/ManageUser';
import { LocationFilters } from './types';

interface RegistrationPieChartProps {
  locationFilters: LocationFilters;
  triggerFetch?: boolean;
}

const RegistrationPieChart: React.FC<RegistrationPieChartProps> = ({ locationFilters, triggerFetch }) => {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ pending: 0, archived: 0, mayJoin: 0 });
  const [loading, setLoading] = useState(true);
  
  const totalCount = counts.pending + counts.archived + counts.mayJoin;
  const isEmpty = totalCount === 0;
  
  // Use actual data or empty state data
  const data = isEmpty 
    ? [{ name: t('USER_REGISTRATION.NO_DATA'), value: 1, color: '#E0E0E0' }]
    : [
        { name: t('USER_REGISTRATION.ACTION_PENDING'), value: counts.pending, color: '#9C27B0' },
        { name: t('USER_REGISTRATION.ARCHIVED_NOT_INTERESTED'), value: counts.archived, color: '#FF4500' },
        { name: t('USER_REGISTRATION.MAY_JOIN_UPCOMING_YEAR'), value: counts.mayJoin, color: '#FFD700' },
      ];
  
  // Legend data always shows actual categories
  const legendData = [
    { name: t('USER_REGISTRATION.ACTION_PENDING'), value: counts.pending, color: '#9C27B0' },
    { name: t('USER_REGISTRATION.ARCHIVED_NOT_INTERESTED'), value: counts.archived, color: '#FF4500' },
    { name: t('USER_REGISTRATION.MAY_JOIN_UPCOMING_YEAR'), value: counts.mayJoin, color: '#FFD700' },
  ];

  const buildFilters = (overrides: Record<string, any> = {}) => {
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
    const filters: Record<string, any> = {
      role: 'Learner',
      ...(tenantId ? { tenantId } : {}),
      ...overrides,
    };
    if (locationFilters.states?.length) {
      filters.state = locationFilters.states;
    }
    if (locationFilters.districts?.length) {
      filters.district = locationFilters.districts;
    }
    if (locationFilters.blocks?.length) {
      filters.block = locationFilters.blocks;
    }
    if (locationFilters.villages?.length) {
      filters.village = locationFilters.villages;
    }
    return filters;
  };

  const fetchCount = async (filters: Record<string, any>) => {
    const response = await fetchUserList({ limit: 1, offset: 0, filters });
    return response?.totalCount || 0;
  };

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const pendingFilters = buildFilters({ tenantStatus: ['pending'], interested_to_join: 'pending' });
        const archivedFilters = buildFilters({ tenantStatus: ['pending'], interested_to_join: 'no' });
        const mayJoinFilters = buildFilters({ tenantStatus: ['pending'], interested_to_join: 'yes' });

        const [pending, archived, mayJoin] = await Promise.all([
          fetchCount(pendingFilters),
          fetchCount(archivedFilters),
          fetchCount(mayJoinFilters),
        ]);

        setCounts({ pending, archived, mayJoin });
      } catch (error) {
        console.error('Error fetching pie counts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [locationFilters.states, locationFilters.districts, locationFilters.blocks, locationFilters.villages, triggerFetch]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#FFF8F2', borderRadius: 2, p: 2, mb: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        {t('USER_REGISTRATION.LEARNER_REGISTRATIONS')}
      </Typography>
      <Box sx={{ height: 200, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: loading ? 'center' : 'flex-start' }}>
        {loading ? (
          <CircularProgress />
        ) : (<>
        <ResponsiveContainer width="40%" height="100%">
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
            >
                {data.map((entry: { color: string }, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5, pl: 2 }}>
          {legendData.map((entry) => (
            <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 400 }}>
                {entry.name} ({entry.value})
              </Typography>
            </Box>
          ))}
        </Box>
        </>)}
      </Box>
    </Box>
  );
};

export default RegistrationPieChart;
