import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

// Services
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

// Models
import { GraphResponseModel, GraphDataModel } from "../../models/liveoccupanytracker";

// const data = [
//   { time_interval : "0hrs", count: 0 },
//   { time_interval: "1hr", count: 80 },
//   { time_interval: "2hrs", count: 60 },
//   { time_interval: "3hrs", count: 70 },
//   { time_interval: "4hrs", count: 40 },
//   { time_interval: "5hrs", count: 20 },
//   { time_interval: "6hrs", count: 90 },
//   { time_interval: "7hrs", count: 70 },
//   { time_interval: "8hrs", count: 10 },
//   { time_interval: "9hrs", count: 60 },
//   { time_interval: "10hrs", count: 30 },
//   { time_interval: "11hrs", count: 50 },
//   { time_interval: "12hrs", count: 10 }
// ];

const CustomTooltip: React.FC<any> = ({ active, payload }) => (
  active && payload && payload.length ? (
    <div className="custom-tooltip">
      <p>{`${payload[0].payload.time_interval}: ${payload[0].payload.percentage}%`}</p>
    </div>
  ) : null
);

const UtilizationGraph: React.FC = () => {
  const occupancyTracker = new OccupancyTracker();

  const [graphData, setGraphData] = useState<GraphDataModel[]>([])

  if (process.env.NODE_ENV === "development") {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps will be removed")
      ) {
        return; // Ignore this specific warning
      }
      originalConsoleError(...args);
    };
  }

  useEffect(() => {
    occupancyTracker.getGraphDetails().then((response: GraphResponseModel) => { 
      const graphData: GraphDataModel[] = response.data.map((item, index) => ({
        time_interval: `${index + 1} hrs`,
        percentage: item.percentage,
      }));
      setGraphData(graphData);
    })
  }, [])

  return (
    <Box sx={{ width: "100%", height: 350, boxShadow: 3, borderRadius: 3 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid />
          <XAxis dataKey="time_interval" />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="percentage" stroke="#00D1A3" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default UtilizationGraph;
