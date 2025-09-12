import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

// --- Iconos SVG ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// --- Componente de Registro ---
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      console.log('Enviando datos:', { email, password });
      console.log('URL:', `${API}/api/register`);
      
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response:', errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Success response:', data);
      setSuccess('¡Usuario registrado! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1a3d] to-[#3a0ca3] flex items-center justify-center font-sans p-4 text-white">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Crear una Cuenta</h2>
            <p className="text-slate-400 mt-2">Únete a nosotros</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                </div>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                </div>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                />
            </div>

            {error && <p className="text-red-400 text-sm text-center !mt-4">{error}</p>}
            {success && <p className="text-green-400 text-sm text-center !mt-4">{success}</p>}
            
            <button type="submit" className="w-full bg-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30">
              Registrar
            </button>
          </form>

          <div className="text-center text-slate-400">
            <p>¿Ya tienes una cuenta?{' '}
              <a href="/" className="font-semibold text-purple-400 hover:text-purple-300 transition">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
