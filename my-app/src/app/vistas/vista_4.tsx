"use client";

import { useState, useEffect } from "react";

interface EstadoOrden {
  status: string;
  cantidad_pedidos: number;
  monto_acumulado: number;
  promedio_orden: number;
}

export default function Vista4() {
  const [data, setData] = useState<EstadoOrden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports/4");
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

  const totalPedidos = data.reduce((sum, e) => sum + Number(e.cantidad_pedidos || 0), 0);
  const montoTotal = data.reduce((sum, e) => sum + Number(e.monto_acumulado || 0), 0);
  const ordenesCompletadas = data.find(e => e.status?.toLowerCase() === "completado" || e.status?.toLowerCase() === "completed");

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

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complet") || s.includes("entrega")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (s.includes("pend") || s.includes("proceso")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (s.includes("cancel")) return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-400 text-sm mb-1">Total de Pedidos</p>
          <p className="text-3xl font-bold text-white">{totalPedidos.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <p className="text-emerald-400 text-sm mb-1">Monto Total Acumulado</p>
          <p className="text-3xl font-bold text-white">${montoTotal.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400 text-sm mb-1">Órdenes Completadas</p>
          <p className="text-3xl font-bold text-white">
            {ordenesCompletadas?.cantidad_pedidos || 0}
          </p>
        </div>
      </div>

      {/* Gráfico de barras simple */}
      <div className="mb-8">
        <h3 className="text-slate-400 text-sm mb-4">Distribución por Estado</h3>
        <div className="space-y-3">
          {data.map((row, index) => {
            const percentage = totalPedidos > 0 ? (Number(row.cantidad_pedidos) / totalPedidos) * 100 : 0;
            return (
              <div key={index} className="flex items-center gap-4">
                <span className="w-32 text-slate-300 text-sm truncate">{row.status}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="w-16 text-right text-slate-300 text-sm">{row.cantidad_pedidos}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-4 px-4 text-slate-400 font-medium">Estado</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Cantidad Pedidos</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Monto Acumulado</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Promedio por Orden</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-white text-right font-semibold">{row.cantidad_pedidos}</td>
                <td className="py-4 px-4 text-emerald-400 text-right font-semibold">
                  ${Number(row.monto_acumulado || 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-blue-400 text-right">
                  ${Number(row.promedio_orden || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <p className="text-center text-slate-500 py-8">No hay datos para mostrar</p>
      )}
    </div>
  );
}
