import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const RegistrationPieChart = () => {
  const data = [
    { name: 'Action Pending', value: 4, color: '#B0B0B0' }, // Grey
    { name: 'Batch Assigned', value: 5, color: '#8A2BE2' }, // Purple
    { name: 'Archived/Not Interested', value: 10, color: '#FF4500' }, // Orange
    { name: 'May join upcoming year', value: 5, color: '#FFD700' }, // Yellow
  ];

  const renderLegendText = (value: string, entry: any) => {
    return (
      <span style={{ color: '#000', fontWeight: 400, fontSize: '12px' }}>
        {value} ({entry.payload.value})
      </span>
    );
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#FFF8F2', borderRadius: 2, p: 2, mb: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        Learner Registrations
      </Typography>
      <Box sx={{ height: 200, display: 'flex', flexDirection: 'row'}}>
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
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        <Box sx={{ width: '60%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="left"
                        formatter={renderLegendText}
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                    {/* Hidden Pie just to render legend correctly without data duplication visual */}
                    <Pie data={data} dataKey="value" cx={-1000} cy={-1000} /> 
                </PieChart>
            </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPieChart;
