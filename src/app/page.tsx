import Link from "next/link";

const reportes = [
  {
    id: 1,
    titulo: "Top Clientes",
    descripcion: "Ranking de clientes por gasto total",
    icono: "TC",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 2,
    titulo: "Categorías Top",
    descripcion: "Ingresos totales por categoría",
    icono: "CT",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    titulo: "Análisis de Productos",
    descripcion: "Stock actual y unidades vendidas",
    icono: "AP",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 4,
    titulo: "Estado de Órdenes",
    descripcion: "Pedidos y montos por estado",
    icono: "EO",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 5,
    titulo: "Ventas Diarias",
    descripcion: "Histórico de ventas por día",
    icono: "VD",
    color: "from-rose-500 to-pink-600"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Dashboard de Reportes</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <p className="text-slate-600">
            Sistema de gestión de reportes. Seleccione una opción para ver los detalles.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" translate="no">
          <div className="bg-white border border-slate-300 p-4 rounded text-center">
            <p className="text-2xl font-bold text-slate-800">5</p>
            <p className="text-slate-500 text-sm">Reportes</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded text-center">
            <p className="text-2xl font-bold text-slate-800">SQL</p>
            <p className="text-slate-500 text-sm">Views</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded text-center">
            <p className="text-2xl font-bold text-slate-800">PG</p>
            <p className="text-slate-500 text-sm">PostgreSQL</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded text-center">
            <p className="text-2xl font-bold text-slate-800">DK</p>
            <p className="text-slate-500 text-sm">Docker</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" translate="no">
          {reportes.map((reporte) => (
            <Link
              key={reporte.id}
              href={`/reports/${reporte.id}`}
              className="block bg-white border border-slate-300 p-6 rounded hover:bg-slate-50"
            >
              <div className="flex justify-end mb-4">
                <span className="text-slate-400 text-xs font-mono">REPORTE #{reporte.id}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {reporte.titulo}
              </h2>

              <p className="text-slate-600 text-sm mb-4">
                {reporte.descripcion}
              </p>
            </Link>
          ))}
        </div>

        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          <p>Base de Datos Avanzadas - Corte 1</p>
        </footer>
      </div>
    </div>
  );
}
