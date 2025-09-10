

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ImcForm from './ImcForm';
import ImcHistorial from './components/ImcHistorial';

const API = import.meta.env.VITE_API_URL;

export interface ImcRecord {
  id: string;
  pesoKg: number;
  alturaM: number;
  imc: number;
  categoria: string;
  createdAt: string;
}


function App() {
  const [records, setRecords] = useState<ImcRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchHistorial = useCallback(async (fInicio?: string, fFin?: string) => {
    setLoading(true);
    try {
      let url = `${API}/imc/historial`;
      const params: string[] = [];
      if (fInicio) params.push(`fechaInicio=${fInicio}`);
      if (fFin) params.push(`fechaFin=${fFin}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const res = await axios.get<ImcRecord[]>(url);
      setRecords(res.data);
    } catch (err) {
      console.error('Error cargando historial', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistorial(fechaInicio, fechaFin);
  };

  return (
    <div>
      <ImcForm onSuccess={() => fetchHistorial(fechaInicio, fechaFin)} />
      <form onSubmit={handleFiltrar} style={{ marginBottom: 16 }}>
        <label>
          Fecha inicio:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label style={{ marginLeft: 12 }}>
          Fecha fin:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
        <button type="submit" style={{ marginLeft: 12 }}>Filtrar</button>
      </form>
      <ImcHistorial records={records} loading={loading} />
    </div>
  );
}

export default App;
