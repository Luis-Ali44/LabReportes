"use client";

import { useState, useEffect } from "react";

interface CategoriaTop {
  categoria: string;
  ingresos_totales: number;
  estatus_negocio: string;
}

export default function Vista2() {
  const [data, setData] = useState<CategoriaTop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstatus, setFiltroEstatus] = useState<string>("todos");

  useEffect(() => {
    fetchData();
  }, [filtroEstatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroEstatus !== "todos") {
        params.append("estatus", filtroEstatus);
      }
      const res = await fetch(`/api/reports/2?${params.toString()}`);
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

  const totalIngresos = data.reduce((sum, c) => sum + Number(c.ingresos_totales || 0), 0);
  const categoriasAltas = data.filter(c => c.estatus_negocio === "Ganancias Altas").length;
  const mejorCategoria = data.length > 0 ? data.reduce((best, c) =>
    Number(c.ingresos_totales) > Number(best.ingresos_totales) ? c : best
    , data[0]) : null;

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
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <p className="text-emerald-400 text-sm mb-1">Total Ingresos</p>
          <p className="text-3xl font-bold text-white">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-6">
          <p className="text-amber-400 text-sm mb-1">Categorías con Ganancias Altas</p>
          <p className="text-3xl font-bold text-white">{categoriasAltas}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-400 text-sm mb-1">Mejor Categoría</p>
          <p className="text-2xl font-bold text-white">{mejorCategoria?.categoria || "N/A"}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Filtrar por estatus:</label>
          <select
            value={filtroEstatus}
            onChange={(e) => setFiltroEstatus(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos</option>
            <option value="Ganancias Altas">Ganancias Altas</option>
            <option value="Ganancias Normales">Ganancias Normales</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-4 px-4 text-slate-400 font-medium">Categoría</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Ingresos Totales</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-center">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{row.categoria}</td>
                <td className="py-4 px-4 text-emerald-400 text-right font-semibold">
                  ${Number(row.ingresos_totales || 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${row.estatus_negocio === "Ganancias Altas"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                    }`}>
                    {row.estatus_negocio}
                  </span>
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
