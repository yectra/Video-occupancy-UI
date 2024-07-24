import React from "react";
import GaugeChart from "react-gauge-chart";

const GaugeComponent: React.FC = () => {
  const percentage = 70;
  const gaugePercentage = percentage / 100;

  return (
    <div style={{ width: "200px", position: "relative" }}>
      <GaugeChart
        id="gauge-chart5"
        nrOfLevels={420}
        arcsLength={[0.5, 0.3, 0.2]}
        colors={["#5BE12C", "#F5CD19", "#EA4228"]}
        percent={gaugePercentage}
        arcPadding={0.02}
        hideText={true}
        style={{ height: 300, width: 300 }}
      />
      <div
        style={{
          position: "absolute",
          left: "100%",
          bottom: "70%",
          transform: "translate(-50%, -50%)",
          fontSize: "20px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default GaugeComponent;
