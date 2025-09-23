<<<<<<< HEAD
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
=======

import axios from "axios";
// Obtenemos la URL base de la API desde las variables de entorno
const API = import.meta.env.VITE_API_URL;

// Definimos la interfaz para el resultado del IMC
export interface ImcResult {
  imc: number;        // Valor numérico del IMC calculado
  categoria: string;  // Categoría según el IMC (ej: "Normal", "Sobrepeso", etc.)
}

// Función asíncrona que calcula el IMC llamando al backend
export const calculateIMC = async (
  altura: number,    // Altura en metros (ej: 1.75)
  peso: number,      // Peso en kilogramos (ej: 70)
  user_id: string    // ID del usuario para guardar el registro
): Promise<ImcResult> => {
  try {
    // Realizamos una petición POST al endpoint /imc/calcular
    const response = await axios.post(`${API}/imc/calcular`, {
      altura,    // Enviamos la altura
      peso,      // Enviamos el peso
      user_id,   // Enviamos el ID del usuario
    });
    return response.data;  // Retornamos la respuesta del servidor
  } catch (error) {
    // En caso de error, lanzamos una excepción con un mensaje descriptivo
    throw new Error("Error al calcular el IMC. Verifica si el backend está corriendo.");
  }
};
>>>>>>> origenISW/tobias-Programacion
