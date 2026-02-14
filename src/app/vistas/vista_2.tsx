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
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Total Ingresos</p>
          <p className="text-3xl font-bold text-slate-800">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Categorías Top</p>
          <p className="text-3xl font-bold text-slate-800">{categoriasAltas}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Mejor Categoría</p>
          <p className="text-2xl font-bold text-slate-800">{mejorCategoria?.categoria || "N/A"}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Filtrar por estatus:</label>
          <select
            value={filtroEstatus}
            onChange={(e) => setFiltroEstatus(e.target.value)}
            className="bg-white border border-slate-300 rounded px-3 py-1 text-slate-700 text-sm"
          >
            <option value="todos">Todos</option>
            <option value="Ganancias Altas">Ganancias Altas</option>
            <option value="Ganancias Normales">Ganancias Normales</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">Categoría</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Ingresos Totales</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-center">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800 font-medium">{row.categoria}</td>
                <td className="py-3 px-4 text-slate-600 text-right font-semibold">
                  ${Number(row.ingresos_totales || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded text-xs font-bold ${row.estatus_negocio === "Ganancias Altas"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-600"
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
