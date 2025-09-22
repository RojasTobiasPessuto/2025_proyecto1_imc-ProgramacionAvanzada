import { useMemo, useState } from "react";
import { Line, Bar, Pie, PolarArea } from "react-chartjs-2";
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
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface ImcRecord {
  id: string;
  pesoKg: number;
  alturaM: number;
  imc: number;
  categoria: string;
  createdAt: string;
  user_id: number;
}

interface EstadisticasProps {
  userId: number;
}

const API = import.meta.env.VITE_API_URL_BACK || import.meta.env.VITE_API_URL;

export default function Estadisticas({ userId }: EstadisticasProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: records = [], isLoading } = useQuery<ImcRecord[]>({
  queryKey: ["estadisticas", userId],
  queryFn: () =>
    fetch(`${API}/api/estadisticas/evolucion?user_id=${userId}`).then((res) =>
      res.json()
    ),
  });

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
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
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
      const mes = fecha.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
      if (!agrupados[mes]) agrupados[mes] = [];
      agrupados[mes].push(Number(r.imc));
    });

    return Object.keys(agrupados).map((mes) => ({
      mes,
      promedio:
        agrupados[mes].reduce((a, b) => a + b, 0) /
        agrupados[mes].length,
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

  // Conteo por categoría (para Pie)
  const conteoCategorias = useMemo(() => {
    const counts: { [cat: string]: number } = {};
    records.forEach((r) => {
      counts[r.categoria] = (counts[r.categoria] || 0) + 1;
    });
    return counts;
  }, [records]);

  const pieData = {
    labels: Object.keys(conteoCategorias),
    datasets: [
      {
        label: "Cantidad",
        data: Object.values(conteoCategorias),
        backgroundColor: [
          "rgba(16, 185, 129, 0.6)", // verde
          "rgba(59, 130, 246, 0.6)", // azul
          "rgba(250, 204, 21, 0.6)", // amarillo
          "rgba(239, 68, 68, 0.6)", // rojo
          "rgba(148, 163, 184, 0.6)", // gris
        ],
        borderColor: "rgba(255,255,255,1)",
        borderWidth: 1,
      },
    ],
  };

  // Variación mensual (para Polar Area)
  const variacionMensual = useMemo(() => {
    const grupos: { [mes: string]: number[] } = {};

    records.forEach((r) => {
      const fecha = new Date(r.createdAt);
      const mes = fecha.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
      if (!grupos[mes]) grupos[mes] = [];
      grupos[mes].push(Number(r.imc));
    });

    return Object.keys(grupos).map((mes) => {
      const valores = grupos[mes];
      const media =
        valores.reduce((a, b) => a + b, 0) / valores.length;
      const desviacionPromedio =
        valores.reduce((a, b) => a + Math.abs(b - media), 0) /
        valores.length;
      return { mes, desviacion: desviacionPromedio };
    });
  }, [records]);

  const polarData = {
    labels: variacionMensual.map((d) => d.mes),
    datasets: [
      {
        label: "Variación Promedio (IMC)",
        data: variacionMensual.map((d) => d.desviacion),
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(250, 204, 21, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(148, 163, 184, 0.6)",
        ],
        borderColor: "rgba(255,255,255,1)",
        borderWidth: 1,
      },
    ],
  };

  if (isLoading)
    return <p className="text-slate-400">Cargando estadísticas...</p>;
  if (!records || records.length === 0) {
    return (
      <p className="text-slate-400">
        No hay datos para mostrar estadísticas.
      </p>
    );
  }

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
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Evolución de Peso e IMC
        </h3>
        <Line data={lineData} />
      </div>

      {/* Gráfico de barras */}
      {promediosMensuales.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Promedio Mensual de IMC
          </h3>
          <Bar data={barData} />
        </div>
      )}

      {/* Pie y Polar Area juntos */}
      {Object.keys(conteoCategorias).length > 0 &&
        variacionMensual.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Distribución por Categoría Total
              </h3>
              <Pie data={pieData} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Variación Promedio Mensual (IMC)
              </h3>
              <PolarArea data={polarData} />
            </div>
          </div>
        )}
    </div>
  );
}