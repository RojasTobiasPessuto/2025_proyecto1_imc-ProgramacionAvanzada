

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

  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<ImcRecord[]>(`${API}/imc/historial`);
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

  return (
    <div>
      <ImcForm onSuccess={fetchHistorial} />
      <ImcHistorial records={records} loading={loading} />
    </div>
  );
}

export default App;
