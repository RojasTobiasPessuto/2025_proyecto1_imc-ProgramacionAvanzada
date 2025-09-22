import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface ImcResult {
  imc: number;
  categoria: string;
}

export const calculateIMC = async (
  altura: number,
  peso: number,
  user_id: string
): Promise<ImcResult> => {
  try {
    const response = await axios.post(`${API}/api/imc/calcular`, {
      altura,
      peso,
      user_id,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al calcular el IMC. Verifica si el backend está corriendo.");
  }
};
