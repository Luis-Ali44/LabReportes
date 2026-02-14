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

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complet") || s.includes("entrega")) return "bg-green-100 text-green-800";
    if (s.includes("pend") || s.includes("proceso")) return "bg-orange-100 text-orange-800";
    if (s.includes("cancel")) return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Total Pedidos</p>
          <p className="text-3xl font-bold text-slate-800">{totalPedidos.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Monto Acumulado</p>
          <p className="text-3xl font-bold text-slate-800">${montoTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Órdenes Completadas</p>
          <p className="text-3xl font-bold text-slate-800">
            {ordenesCompletadas?.cantidad_pedidos || 0}
          </p>
        </div>
      </div>

      {/* Gráfico de barras simple */}
      <div className="mb-8">
        <h3 className="text-slate-700 text-sm font-semibold mb-4">Distribución por Estado</h3>
        <div className="space-y-3">
          {data.map((row, index) => {
            const percentage = totalPedidos > 0 ? (Number(row.cantidad_pedidos) / totalPedidos) * 100 : 0;
            return (
              <div key={index} className="flex items-center gap-4">
                <span className="w-32 text-slate-600 text-sm truncate">{row.status}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-blue-900 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="w-16 text-right text-slate-600 text-sm">{row.cantidad_pedidos}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">Estado</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Cantidad Pedidos</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Monto Acumulado</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Promedio por Orden</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <span className={`inline-flex px-3 py-1 rounded text-xs font-bold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 text-right font-medium">{row.cantidad_pedidos}</td>
                <td className="py-3 px-4 text-slate-800 text-right font-semibold">
                  ${Number(row.monto_acumulado || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-slate-600 text-right">
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
