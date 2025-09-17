import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImcForm from './ImcForm';
import ImcHistorial from './components/ImcHistorial';
import Login from './components/Login';
import Register from './components/Register';
import Estadisticas from './components/Estadisticas';

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

  // Estado y refs para el menú de perfil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Cierra el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Iconos SVG
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  // Página principal protegida
  const MainPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1a3d] to-[#3a0ca3] flex items-center justify-center font-sans p-4 text-white" style={{ position: 'relative' }}>
      {/* Menú de perfil superior derecho */}
      {user && (
        <div ref={profileRef} style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              padding: 8,
              borderRadius: 9999,
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
            aria-label="Abrir menú de perfil"
          >
            <UserIcon />
          </button>
          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              width: 256,
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              padding: 16,
            }}>
              <div style={{ borderBottom: '1px solid #334155', paddingBottom: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Sesión iniciada como:</p>
                <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  color: '#fca5a5',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <LogoutIcon /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-6xl space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold">Calculadora de IMC</h1>
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

      {/* 👇 Nuevo bloque de estadísticas */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
        <Estadisticas records={records} />
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