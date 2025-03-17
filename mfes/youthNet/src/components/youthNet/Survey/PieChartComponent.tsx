import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

interface UserData {
  gender: string;
  age: number;
}


interface PieChartComponentProps {
  title: string;
  data: { name: string; value: number; color: string }[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ title, data }) => (
  <Card sx={{ width: 300, margin: 2, padding: 2, backgroundColor: "#f8efe6", borderRadius: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <PieChart width={250} height={250}>
        <Pie data={data} cx={125} cy={125} outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </CardContent>
  </Card>
);

export default PieChartComponent;
