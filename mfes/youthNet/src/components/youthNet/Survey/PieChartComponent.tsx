import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface PieChartComponentProps {
  title: string;
  data: { name: string; value: number; color?: string }[];
}

const ageGroups = [
  { name: "10-15", color: "#26A69A" },
  { name: "15-20", color: "#6200EE" },
  { name: "20-25", color: "#FFC107" },
  { name: "25-30", color: "#EE6002" },
  { name: "30+", color: "#FF33A8" },
];

const genderColors = {
  Male: "#EE6002",
  Female: "#26A69A",
};

const processAgeData = (data: { name: string; value: number }[]) => {
  return data.map((entry) => {
    const age = parseInt(entry.name);
    let group = ageGroups.find(({ name }) => {
      if (name.includes("+")) return age >= 30;
      const [min, max] = name.split("-").map(Number);
      return age >= min && age < max;
    });
    return { ...entry, color: group?.color || "#000" };
  });
};

const processGenderData = (data: { name: string; value: number }[]) => {
  return data.map((entry) => ({
    ...entry,
    color: genderColors[entry.name as keyof typeof genderColors] || "#000",
  }));
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ title, data }) => {
  const processedData = title === "Age" ? processAgeData(data) : processGenderData(data);

  return (
    <Card sx={{ width: 350, margin: 2, padding: 2, backgroundColor: "#f8efe6", borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <PieChart width={300} height={250}>
          <Pie data={processedData} cx={150} cy={100} outerRadius={80} dataKey="value">
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        {title === "Age" && (
          <Box >
            <Typography variant="subtitle1">Age Group Colors:</Typography>
            {ageGroups.map(({ name, color }) => (
              <Box key={name} display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, backgroundColor: color, marginRight: 1 }} />
                <Typography>{name}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {title === "Gender" && (
          <Box >
            <Typography variant="subtitle1">Gender Colors:</Typography>
            {Object.entries(genderColors).map(([name, color]) => (
              <Box key={name} display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, backgroundColor: color, marginRight: 1 }} />
                <Typography>{name}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartComponent;
