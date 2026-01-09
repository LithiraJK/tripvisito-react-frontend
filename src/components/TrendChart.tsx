import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface TrendChartProps {
  trend: "increment" | "decrement" | "neutral";
  data?: number[];
}

const TrendChart = ({ trend, data }: TrendChartProps) => {
  // Generate smooth curve data if not provided
  const defaultData = data || [30, 25, 35, 28, 40, 35, 45];

  // Color schemes based on trend
  const colors = {
    increment: {
      border: "rgba(34, 197, 94, 1)",
      background: "rgba(34, 197, 94, 0.1)",
    },
    decrement: {
      border: "rgba(239, 68, 68, 1)",
      background: "rgba(239, 68, 68, 0.1)",
    },
    neutral: {
      border: "rgba(156, 163, 175, 1)",
      background: "rgba(156, 163, 175, 0.1)",
    },
  };

  const chartData = {
    labels: Array(defaultData.length).fill(""),
    datasets: [
      {
        data: defaultData,
        borderColor: colors[trend].border,
        backgroundColor: colors[trend].background,
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Makes the line smooth/curved
        pointRadius: 0, // Hides data points
        pointHoverRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="xl:w-32 w-full h-24 md:h-32 xl:h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
