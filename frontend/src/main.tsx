// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 👇 Importamos lo necesario de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Creamos una instancia del cliente de queries
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 Envolvemos la App con el proveedor */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
