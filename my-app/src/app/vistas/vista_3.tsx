"use client";

import { useState, useEffect } from "react";

interface AnalisisProducto {
  producto: string;
  stock_actual: number;
  total_vendido: number;
  valor_monetario_stock: number;
}

export default function Vista3() {
  const [data, setData] = useState<AnalisisProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [stockMinimo, setStockMinimo] = useState<number | "">("");

  useEffect(() => {
    fetchData();
  }, [limit, page, stockMinimo]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (stockMinimo !== "") {
        params.append("stock_min", String(stockMinimo));
      }
      const res = await fetch(`/api/reports/3?${params.toString()}`);
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

  const valorTotalInventario = data.reduce((sum, p) => sum + Number(p.valor_monetario_stock || 0), 0);
  const totalUnidadesVendidas = data.reduce((sum, p) => sum + Number(p.total_vendido || 0), 0);
  const productosSinStock = data.filter(p => p.stock_actual === 0).length;

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
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400 text-sm mb-1">Valor Total Inventario</p>
          <p className="text-3xl font-bold text-white">${valorTotalInventario.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <p className="text-emerald-400 text-sm mb-1">Unidades Vendidas (mostradas)</p>
          <p className="text-3xl font-bold text-white">{totalUnidadesVendidas.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 rounded-xl p-6">
          <p className="text-red-400 text-sm mb-1">Productos Sin Stock</p>
          <p className="text-3xl font-bold text-white">{productosSinStock}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Stock mínimo:</label>
          <input
            type="number"
            value={stockMinimo}
            onChange={(e) => { setStockMinimo(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }}
            placeholder="Ej: 10"
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
              <th className="py-4 px-4 text-slate-400 font-medium">Producto</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Stock Actual</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Unidades Vendidas</th>
              <th className="py-4 px-4 text-slate-400 font-medium text-right">Valor del Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{row.producto}</td>
                <td className="py-4 px-4 text-right">
                  <span className={`font-semibold ${row.stock_actual === 0 ? "text-red-400" :
                      row.stock_actual < 20 ? "text-amber-400" :
                        "text-emerald-400"
                    }`}>
                    {row.stock_actual}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-300 text-right">{row.total_vendido}</td>
                <td className="py-4 px-4 text-blue-400 text-right font-semibold">
                  ${Number(row.valor_monetario_stock || 0).toLocaleString()}
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
