import { useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ImcRecord } from "../App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EstadisticasProps {
  records: ImcRecord[];
}

export default function Estadisticas({ records }: EstadisticasProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!records || records.length === 0) {
    return <p className="text-slate-400">No hay datos para mostrar estadísticas.</p>;
  }

  // Filtrar y ordenar
  const sorted = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return [...records]
      .filter((r) => {
        const d = new Date(r.createdAt);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      })
      .sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [records, startDate, endDate]);

  // Labels en el eje X
  const labels = sorted.map((r) =>
    new Date(r.createdAt).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  );

  // Datos para peso e IMC
  const pesoData = sorted.map((r) => r.pesoKg);
  const imcData = sorted.map((r) => r.imc);

  // Promedios mensuales
  const promediosMensuales = useMemo(() => {
    const agrupados: { [mes: string]: number[] } = {};

    sorted.forEach((r) => {
      const fecha = new Date(r.createdAt);
      const mes = fecha.toLocaleString("es-ES", { month: "long", year: "numeric" });
      if (!agrupados[mes]) agrupados[mes] = [];
      agrupados[mes].push(Number(r.imc));
    });

    return Object.keys(agrupados).map((mes) => ({
      mes,
      promedio:
        agrupados[mes].reduce((a, b) => a + b, 0) / agrupados[mes].length,
    }));
  }, [sorted]);

  // Data para gráfico de líneas
  const lineData = {
    labels,
    datasets: [
      {
        label: "Peso (kg)",
        data: pesoData,
        borderColor: "rgb(59, 130, 246)", // azul
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "IMC",
        data: imcData,
        borderColor: "rgb(16, 185, 129)", // verde
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#e5e7eb" },
      },
      title: {
        display: true,
        text: "Evolución de Peso e IMC",
        color: "#f3f4f6",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // Data para gráfico de barras
  const barData = {
    labels: promediosMensuales.map((d) => d.mes),
    datasets: [
      {
        label: "Promedio IMC",
        data: promediosMensuales.map((d) => d.promedio),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
      </div>

      {/* Gráfico de líneas */}
      <Line data={lineData} options={lineOptions} />

      {/* Gráfico de barras */}
      {promediosMensuales.length > 0 && (
        <div className="mt-8">
          <Bar data={barData} options={barOptions} />
        </div>
      )}
    </div>
  );
}
