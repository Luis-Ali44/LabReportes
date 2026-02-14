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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Ventas (periodo)</p>
          <p className="text-2xl font-bold text-slate-800">${totalVentas.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Órdenes</p>
          <p className="text-2xl font-bold text-slate-800">{totalOrdenes.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Ticket Promedio</p>
          <p className="text-2xl font-bold text-slate-800">${promedioGeneral.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Mejor Día</p>
          <p className="text-xl font-bold text-slate-800">
            {mejorDia ? `$${Number(mejorDia.ventas_totales).toLocaleString()}` : "N/A"}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Desde:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); setPage(1); }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Hasta:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); setPage(1); }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Mostrar:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-sm"
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
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Gráfico de barras de ventas */}
      {data.length > 0 && (
        <div className="mb-8">
          <h3 className="text-slate-700 text-sm font-semibold mb-4">Tendencia de Ventas</h3>
          <div className="flex items-end gap-1 h-32 bg-slate-50 rounded border border-slate-200 p-4">
            {data.map((row, index) => {
              const maxVentas = Math.max(...data.map(d => Number(d.ventas_totales)));
              const height = maxVentas > 0 ? (Number(row.ventas_totales) / maxVentas) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-900 rounded-t-sm hover:bg-blue-800 cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${formatDate(row.fecha_venta)}: $${Number(row.ventas_totales).toLocaleString()}`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${Number(row.ventas_totales).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">Fecha</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Órdenes</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Ventas Totales</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800 font-medium">{formatDate(row.fecha_venta)}</td>
                <td className="py-3 px-4 text-slate-600 text-right">{row.total_ordenes}</td>
                <td className="py-3 px-4 text-slate-800 text-right font-medium">
                  ${Number(row.ventas_totales || 0).toLocaleString()}
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

      {data.length === 0 && (
        <p className="text-center text-slate-500 py-8">No hay datos para el periodo seleccionado</p>
      )}
    </div>
  );
}
