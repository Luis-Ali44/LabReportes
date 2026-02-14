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
      <div className="text-center py-12 text-slate-500">
        Cargando datos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Clientes Mostrados</p>
          <p className="text-3xl font-bold text-slate-800">{data.length}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Gasto Total</p>
          <p className="text-3xl font-bold text-slate-800">${totalGastoGeneral.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Ticket Promedio</p>
          <p className="text-3xl font-bold text-slate-800">${promedioTicket.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Mostrar:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-white border border-slate-300 rounded px-3 py-1 text-slate-700 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">#</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">Cliente</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Órdenes</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Gasto Total</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-600">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${row.posicion <= 3 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                    }`}>
                    {row.posicion}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">{row.usuarios}</td>
                <td className="py-3 px-4 text-slate-600 text-right">{row.total_ordenes}</td>
                <td className="py-3 px-4 text-slate-800 text-right font-medium">
                  ${Number(row.total_gasto || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-600 text-right">
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
            className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded disabled:opacity-50 hover:bg-slate-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={data.length < limit}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded disabled:opacity-50 hover:bg-slate-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
