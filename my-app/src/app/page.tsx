import Link from "next/link";

const reportes = [
  {
    id: 1,
    titulo: "Top Clientes",
    descripcion: "Ranking de clientes por gasto total, con ticket promedio y posición",
    icono: "👑",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 2,
    titulo: "Categorías Top",
    descripcion: "Ingresos totales por categoría con clasificación de rendimiento",
    icono: "📊",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    titulo: "Análisis de Productos",
    descripcion: "Stock actual, unidades vendidas y valor monetario del inventario",
    icono: "📦",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 4,
    titulo: "Estado de Órdenes",
    descripcion: "Cantidad de pedidos y montos acumulados por estado",
    icono: "🛒",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 5,
    titulo: "Ventas Diarias",
    descripcion: "Histórico de ventas por día con totales y promedios",
    icono: "📈",
    color: "from-rose-500 to-pink-600"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            📊 Dashboard de Reportes
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sistema de visualización de reportes SQL con PostgreSQL Views
          </p>
        </header>

        {/* KPIs Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-slate-400 text-sm">Reportes</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-emerald-400">SQL</p>
            <p className="text-slate-400 text-sm">Views</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">PG</p>
            <p className="text-slate-400 text-sm">PostgreSQL</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">🐳</p>
            <p className="text-slate-400 text-sm">Docker</p>
          </div>
        </div>

        {/* Reportes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportes.map((reporte) => (
            <Link
              key={reporte.id}
              href={`/reports/${reporte.id}`}
              className="group relative overflow-hidden bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-900/50"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reporte.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{reporte.icono}</span>
                  <span className="text-slate-500 text-sm font-mono">VIEW_{reporte.id}</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300">
                  {reporte.titulo}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {reporte.descripcion}
                </p>
                <div className="mt-4 flex items-center text-slate-500 text-sm group-hover:text-slate-300 transition-colors">
                  <span>Ver reporte</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>Base de Datos Avanzadas • Lab Reportes Next.js</p>
        </footer>
      </div>
    </div>
  );
}
