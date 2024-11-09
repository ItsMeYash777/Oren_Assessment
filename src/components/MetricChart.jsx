import React, { forwardRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const MetricChart = forwardRef(({ title, data }, ref) => {
  const chartData = {
    labels: data.map((_, index) => new Date().getFullYear() - 4 + index),
    datasets: [
      {
        label: title,
        data: data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div
      className="chart-container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      ref={ref}
    >
      <Line data={chartData} options={options} />
    </div>
  );
});

// Adding displayName to avoid the ESLint warning
MetricChart.displayName = "MetricChart";

export default MetricChart;
