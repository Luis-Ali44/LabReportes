"use client";

import { useState, useEffect } from "react";

interface VentaDiaria {
  fecha_venta: string;
  total_ordenes: number;
  ventas_totales: number;
  ticket_promedio: number;
}

export default function Vista5() {
  const [data, setData] = useState<VentaDiaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [fechaInicio, fechaFin, limit, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);

      const res = await fetch(`/api/reports/5?${params.toString()}`);
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

  const totalVentas = data.reduce((sum, v) => sum + Number(v.ventas_totales || 0), 0);
  const totalOrdenes = data.reduce((sum, v) => sum + Number(v.total_ordenes || 0), 0);
  const promedioGeneral = data.length > 0
    ? data.reduce((sum, v) => sum + Number(v.ticket_promedio || 0), 0) / data.length
    : 0;
  const mejorDia = data.length > 0 ? data.reduce((best, v) =>
    Number(v.ventas_totales) > Number(best.ventas_totales) ? v : best
    , data[0]) : null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-MX", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-rose-500/20 to-pink-600/20 border border-rose-500/30 rounded-xl p-6">
          <p className="text-rose-400 text-sm mb-1">Ventas Totales (periodo)</p>
          <p className="text-3xl font-bold text-white">${totalVentas.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-400 text-sm mb-1">Órdenes Totales</p>
          <p className="text-3xl font-bold text-white">{totalOrdenes.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400 text-sm mb-1">Ticket Promedio</p>
          <p className="text-3xl font-bold text-white">${promedioGeneral.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <p className="text-emerald-400 text-sm mb-1">Mejor Día</p>
          <p className="text-xl font-bold text-white">
            {mejorDia ? `$${Number(mejorDia.ventas_totales).toLocaleString()}` : "N/A"}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Desde:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); setPage(1); }}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Hasta:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); setPage(1); }}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Mostrar:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        {(fechaInicio || fechaFin) && (
          <button
            onClick={() => { setFechaInicio(""); setFechaFin(""); setPage(1); }}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Gráfico de barras de ventas */}
      {data.length > 0 && (
        <div className="mb-8">
          <h3 className="text-slate-400 text-sm mb-4">Tendencia de Ventas</h3>
          <div className="flex items-end gap-1 h-32 bg-slate-800/50 rounded-xl p-4">
            {data.map((row, index) => {
              const maxVentas = Math.max(...data.map(d => Number(d.ventas_totales)));
              const height = maxVentas > 0 ? (Number(row.ventas_totales) / maxVentas) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-sm transition-all duration-300 hover:from-rose-400 hover:to-pink-300 cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${formatDate(row.fecha_venta)}: $${Number(row.ventas_totales).toLocaleString()}`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${Number(row.ventas_totales).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-4 px-4 text-slate-400 font-medium">Fecha</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Órdenes</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Ventas Totales</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{formatDate(row.fecha_venta)}</td>
                <td className="py-4 px-4 text-slate-300 text-right">{row.total_ordenes}</td>
                <td className="py-4 px-4 text-emerald-400 text-right font-semibold">
                  ${Number(row.ventas_totales || 0).toLocaleString()}
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

      {data.length === 0 && (
        <p className="text-center text-slate-500 py-8">No hay datos para el periodo seleccionado</p>
      )}
    </div>
  );
}
