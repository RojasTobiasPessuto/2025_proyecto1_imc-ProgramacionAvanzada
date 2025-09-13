import { useEffect, useState } from 'react';import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImcForm from './ImcForm';
import ImcHistorial from './components/ImcHistorial';
import Login from './components/Login';
import Register from './components/Register';

const API = import.meta.env.VITE_API_URL;

export interface ImcRecord {
  id: number;
  pesoKg: number;
  alturaM: number;
  imc: number;
  categoria: string;
  createdAt: string;
}

export interface ImcResult {
  imc: number;
  categoria: string;
}

export default function App() {
  const [records, setRecords] = useState<ImcRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [user, setUser] = useState(() => {
    // Intenta recuperar el usuario del localStorage
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const fetchRecords = async () => {
  setLoading(true);
  try {
    // Usa el id del usuario guardado en el estado
    if (!user || !user.id) {
      throw new Error('No hay usuario logueado');
    }
    const response = await axios.get(`${API}/api/imc/historial`, {
      params: { user_id: user.id }
    });
    setRecords(response.data);
  } catch (error) {
    console.error('Error fetching records:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  // Función para manejar login exitoso
  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Página principal protegida
  const MainPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1a3d] to-[#3a0ca3] flex items-center justify-center font-sans p-4 text-white">
      <div className="w-full max-w-6xl space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold">Calculadora de IMC</h1>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-600 rounded">Cerrar sesión</button>
        </header>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <ImcForm
            onSuccess={fetchRecords}
            resultado={resultado}
            setResultado={setResultado}
          />
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <ImcHistorial records={records} loading={loading} />
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={user ? <MainPage /> : <Navigate to="/login" />} />
        {/* Puedes agregar más rutas protegidas aquí */}
      </Routes>
    </Router>
  );
}