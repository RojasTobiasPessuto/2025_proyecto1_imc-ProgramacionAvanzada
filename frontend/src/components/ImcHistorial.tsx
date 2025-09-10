import React, { useEffect, useState } from "react";
import axios from "axios";


import { ImcRecord } from '../App';

interface ImcHistorialProps {
  records: ImcRecord[];
  loading: boolean;
}

export default function ImcHistorial({ records, loading }: ImcHistorialProps) {
  return (
    <div>
      <h2>Historial de cálculos IMC</h2>
      {loading && <p>Cargando...</p>}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Peso (kg)</th>
            <th>Altura (m)</th>
            <th>IMC</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>{r.pesoKg}</td>
              <td>{r.alturaM}</td>
              <td>{r.imc}</td>
              <td>{r.categoria}</td>
            </tr>
          ))}
          {records.length === 0 && !loading && (
            <tr>
              <td colSpan={5}>No hay registros todavía</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
