"use client";

import { useState, useEffect } from "react";

interface TopUser {
  usuarios: string;
  total_ordenes: number;
  total_gasto: number;
  posicion: number;
  ticket_promedio: number;
}

export default function Vista1() {
  const [data, setData] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [limit, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const res = await fetch(`/api/reports/1?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const totalGastoGeneral = data.reduce((sum, u) => sum + Number(u.total_gasto || 0), 0);
  const promedioTicket = data.length > 0
    ? data.reduce((sum, u) => sum + Number(u.ticket_promedio || 0), 0) / data.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 text-red-400">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-6">
          <p className="text-amber-400 text-sm mb-1">Total Clientes Mostrados</p>
          <p className="text-3xl font-bold text-white">{data.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <p className="text-emerald-400 text-sm mb-1">Gasto Total Acumulado</p>
          <p className="text-3xl font-bold text-white">${totalGastoGeneral.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400 text-sm mb-1">Ticket Promedio General</p>
          <p className="text-3xl font-bold text-white">${promedioTicket.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Mostrar:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-4 px-4 text-slate-400 font-medium">Posición</th>
              <th className="py-4 px-4 text-slate-400 font-medium">Cliente</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Órdenes</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Gasto Total</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${row.posicion === 1 ? "bg-amber-500 text-black" :
                      row.posicion === 2 ? "bg-slate-400 text-black" :
                        row.posicion === 3 ? "bg-amber-700 text-white" :
                          "bg-slate-700 text-slate-300"
                    }`}>
                    {row.posicion}
                  </span>
                </td>
                <td className="py-4 px-4 text-white font-medium">{row.usuarios}</td>
                <td className="py-4 px-4 text-slate-300 text-right">{row.total_ordenes}</td>
                <td className="py-4 px-4 text-emerald-400 text-right font-semibold">
                  ${Number(row.total_gasto || 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-blue-400 text-right">
                  ${Number(row.ticket_promedio || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-slate-500 text-sm">
          Página {page}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={data.length < limit}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
