import { useState, useMemo } from "react";
import { ImcRecord } from '../App';

interface ImcHistorialProps {
  records: ImcRecord[];
  loading: boolean;
}

// Iconos SVG


const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function ImcHistorial({ records, loading }: ImcHistorialProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrar historial por fechas
  const filteredRecords = useMemo(() => {
    if (!startDate && !endDate) return records;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Ajustar la hora para incluir el día completo
    if(start) start.setHours(0, 0, 0, 0);
    if(end) end.setHours(23, 59, 59, 999);

    return records.filter(record => {
      const recordDate = new Date(record.createdat);
      if (start && end) return recordDate >= start && recordDate <= end;
      if (start) return recordDate >= start;
      if (end) return recordDate <= end;
      return true;
    });
  }, [records, startDate, endDate]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Normal': return 'text-green-400';
      case 'Bajo peso': return 'text-blue-400';
      case 'Sobrepeso': return 'text-yellow-400';
      default: return categoria.includes('Obesidad') ? 'text-red-400' : 'text-slate-400';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-semibold text-2xl">Historial de cálculos</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <span className="text-slate-400">-</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button 
            onClick={clearFilters} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/80 rounded-lg hover:bg-slate-600/80 transition"
          >
            <ClearIcon/> Limpiar
          </button>
        </div>
      </div>
      
      <div className="h-64 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">Cargando...</div>
          </div>
        ) : filteredRecords.length > 0 ? (
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-900/60 backdrop-blur-sm">
              <tr>
                {['Fecha', 'Peso', 'Altura', 'IMC', 'Categoría'].map(h => (
                  <th key={h} className="py-3 px-3 font-semibold text-slate-300 border-b border-slate-700 text-sm">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {filteredRecords.map((r) => (
    <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
      <td className="py-3 px-3 border-b border-slate-800 text-sm text-slate-400">
        {new Date(r.createdat).toLocaleDateString('es-ES')}
      </td>
      <td className="py-3 px-3 border-b border-slate-800 text-sm text-slate-400">
        {r.pesoKg} kg
      </td>
      <td className="py-3 px-3 border-b border-slate-800 text-sm text-slate-400">
        {r.alturaM} m
      </td>
      <td className="py-3 px-3 border-b border-slate-800 text-sm font-bold text-white">
        {Number(r.imc).toFixed(2)}
      </td>
      <td className={`py-3 px-3 border-b border-slate-800 text-sm font-semibold ${getCategoryColor(r.categoria)}`}>
        {r.categoria}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <p className="font-medium text-lg">No hay datos que mostrar</p>
            <p className="text-sm mt-1">Prueba a cambiar los filtros o añade un nuevo cálculo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
