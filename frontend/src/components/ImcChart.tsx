import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ImcChartProps {
  records: { mes: string; promedio: number }[];
}

const ImcChart: React.FC<ImcChartProps> = ({ records }) => {
  const chartData = {
    labels: records.map((d) => d.mes), // meses
    datasets: [
      {
        label: "Promedio IMC",
        data: records.map((d) => d.promedio), // valores
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Promedio Mensual de IMC",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ImcChart;