import React from "react";
import { Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const data = [
  { time: "0hrs", value: 0 },
  { time: "1hr", value: 80 },
  { time: "2hrs", value: 60 },
  { time: "3hrs", value: 70 },
  { time: "4hrs", value: 40 },
  { time: "5hrs", value: 20 },
  { time: "6hrs", value: 90 },
  { time: "7hrs", value: 70 },
  { time: "8hrs", value: 10 },
  { time: "9hrs", value: 60 },
  { time: "10hrs", value: 30 },
  { time: "11hrs", value: 50 },
  { time: "12hrs", value: 10 }
];

const CustomTooltip: React.FC<any> = ({ active, payload }) => (
  active && payload && payload.length ? (
    <div className="custom-tooltip">
      <p>{`${payload[0].payload.time}: ${payload[0].payload.value}%`}</p>
    </div>
  ) : null
);

const UtilizationGraph: React.FC = () => (
  <Box sx={{ width: "100%", height: 350,  boxShadow: 3, borderRadius: 3 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid />
        <XAxis dataKey="time" />
        <YAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]}  />
        <Tooltip content={<CustomTooltip />} />
        <Legend/>
        <Line type="monotone" dataKey="value" stroke="#00D1A3" strokeWidth={3} dot />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

export default UtilizationGraph;
