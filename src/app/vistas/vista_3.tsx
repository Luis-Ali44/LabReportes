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
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Valor Inventario</p>
          <p className="text-3xl font-bold text-slate-800">${valorTotalInventario.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Unidades Vendidas</p>
          <p className="text-3xl font-bold text-slate-800">{totalUnidadesVendidas.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-300 rounded p-4 text-center shadow-sm">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-wide">Sin Stock</p>
          <p className="text-3xl font-bold text-red-600">{productosSinStock}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 text-sm font-medium">Stock mínimo:</label>
          <input
            type="number"
            value={stockMinimo}
            onChange={(e) => { setStockMinimo(e.target.value === "" ? "" : Number(e.target.value)); setPage(1); }}
            placeholder="Ej: 10"
            className="bg-white border border-slate-300 rounded px-3 py-1 text-slate-700 text-sm w-24"
          />
        </div>
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
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm">Producto</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Stock Actual</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Unidades Vendidas</th>
              <th className="py-3 px-4 text-slate-700 font-semibold text-sm text-right">Valor del Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800 font-medium">{row.producto}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${row.stock_actual === 0 ? "text-red-600" :
                    row.stock_actual < 20 ? "text-orange-600" :
                      "text-green-600"
                    }`}>
                    {row.stock_actual}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 text-right">{row.total_vendido}</td>
                <td className="py-3 px-4 text-slate-800 text-right font-medium">
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
