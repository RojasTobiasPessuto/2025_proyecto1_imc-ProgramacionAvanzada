import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImcForm from './ImcForm';
import ImcHistorial from './components/ImcHistorial';

const API = import.meta.env.VITE_API_URL;

export interface ImcRecord {
  id: number;
  pesoKg: number;
  alturaM: number;
  imc: number;
  categoria: string;
  createdAt: string;
}

export default function App() {
  const [records, setRecords] = useState<ImcRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/imc/historial`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1a3d] to-[#3a0ca3] flex items-center justify-center font-sans p-4 text-white">
      <div className="w-full max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold">Calculadora de IMC</h1>
          <p className="text-slate-400 mt-2 text-lg">Organiza tu seguimiento de salud con estilo y eficiencia.</p>
        </header>

        {/* Sección del Formulario */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <ImcForm onSuccess={fetchRecords} />
        </div>

        {/* Sección del Historial */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <ImcHistorial records={records} loading={loading} />
        </div>
      </div>
    </div>
  );
}

