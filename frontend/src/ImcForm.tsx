import React, { useState } from "react";
import { calculateIMC, ImcResult } from "./imcService"; // importamos el service

interface ImcFormProps {
  onSuccess: () => void;
  resultado: ImcResult | null;
  setResultado: (r: ImcResult | null) => void;
}

// Icono de calculadora
const CalculatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="16" y1="10" x2="16" y2="14"></line>
    <line x1="12" y1="10" x2="12" y2="14"></line>
    <line x1="8" y1="10" x2="8" y2="14"></line>
    <line x1="8" y1="18" x2="16" y2="18"></line>
  </svg>
);

function ImcForm({ onSuccess, resultado, setResultado }: ImcFormProps) {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [errores, setErrores] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    const nuevosErrores: string[] = [];

    // Validaciones
    if (isNaN(alturaNum) || alturaNum <= 0 || alturaNum >= 3) {
      nuevosErrores.push(
        "La altura debe ser un número válido mayor que 0 y menor a 3 metros."
      );
    }

    if (isNaN(pesoNum) || pesoNum <= 0 || pesoNum >= 500) {
      nuevosErrores.push(
        "El peso debe ser un número válido mayor que 0 y menor a 500 kg."
      );
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setResultado(null);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const user_id = user.id;
      if (!user_id) {
        setErrores(["No hay usuario logueado."]);
        setResultado(null);
        return;
      }

      const data = await calculateIMC(alturaNum, pesoNum, user_id); // usamos el service
      setResultado(data);
      setErrores([]);
      onSuccess();
    } catch (err: any) {
      setErrores([err.message || "Error inesperado al calcular el IMC."]);
      setResultado(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="altura"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Altura (m)
          </label>
          <input
            type="number"
            id="altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            step="0.01"
            min="0.1"
            placeholder="Ej: 1.75"
            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        <div>
          <label
            htmlFor="peso"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Peso (kg)
          </label>
          <input
            type="number"
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            min="1"
            placeholder="Ej: 70.5"
            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        {/* Mostrar errores */}
        {errores.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <ul className="text-red-400 text-sm space-y-1">
              {errores.map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-transform transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          <CalculatorIcon /> Calcular IMC
        </button>
      </form>

      {/* Resultado */}
      <div className="flex items-center justify-center">
        {resultado ? (
          <div className="text-center bg-slate-800/50 p-6 rounded-lg w-full">
            <p className="text-lg text-slate-300 mb-4">
              Tu resultado más reciente:
            </p>
            <p className="text-6xl font-bold text-white my-2">
              {resultado.imc.toFixed(2)}
            </p>
            <p
              className={`text-2xl font-semibold ${
                resultado.categoria === "Normal"
                  ? "text-green-400"
                  : resultado.categoria === "Bajo peso"
                  ? "text-blue-400"
                  : resultado.categoria === "Sobrepeso"
                  ? "text-yellow-400"
                  : resultado.categoria.includes("Obesidad")
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {resultado.categoria}
            </p>
          </div>
        ) : (
          <div className="text-center text-slate-400 p-6">
            <p>El resultado de tu cálculo aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default ImcForm;
=======
export default ImcForm;
>>>>>>> origenISW/tobias-Programacion
