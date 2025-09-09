import axios from "axios";
import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL;

interface ImcResult {
  imc: number;
  categoria: string;
}

function ImcForm() {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [errores, setErrores] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    const nuevosErrores: string[] = [];

    // Validaciones avanzadas
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
      const response = await axios.post(`${API}/imc/calcular`, {
        altura: alturaNum,
        peso: pesoNum,
      });
      setResultado(response.data);
      setErrores([]); // limpiar errores si todo salió bien
    } catch (err) {
      setErrores([
        "Error al calcular el IMC. Verifica si el backend está corriendo.",
      ]);
      setResultado(null);
    }
  };

  return (
    <div>
      <h1>Calculadora de IMC</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Altura (m):</label>
          <input
            type="number"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            step="0.01"
            min="0.1"
          />
        </div>
        <div>
          <label>Peso (kg):</label>
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            min="1"
          />
        </div>
        <button type="submit">Calcular</button>
      </form>

      {/* Mostrar resultado */}
      {resultado && (
        <div>
          <p>✅ IMC: {resultado.imc.toFixed(2)}</p>
          <p>📊 Categoría: {resultado.categoria}</p>
        </div>
      )}

      {/* Mostrar todos los errores */}
      {errores.length > 0 && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <ul>
            {errores.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImcForm;