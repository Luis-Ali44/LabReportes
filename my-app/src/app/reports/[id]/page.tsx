import { notFound } from "next/navigation";
import Link from "next/link";
import Vista1 from "@/app/vistas/vista_1";
import Vista2 from "@/app/vistas/vista_2";
import Vista3 from "@/app/vistas/vista_3";
import Vista4 from "@/app/vistas/vista_4";
import Vista5 from "@/app/vistas/vista_5";

const reportesInfo: Record<string, { titulo: string; descripcion: string; icono: string }> = {
    "1": {
        titulo: "Top Clientes",
        descripcion: "Ranking de clientes por gasto total. Muestra ticket promedio, total de órdenes y posición en el ranking.",
        icono: "👑"
    },
    "2": {
        titulo: "Categorías Top",
        descripcion: "Ingresos totales por categoría de productos con clasificación de rendimiento (Ganancias Altas/Normales).",
        icono: "📊"
    },
    "3": {
        titulo: "Análisis de Productos",
        descripcion: "Inventario actual de productos: stock disponible, unidades vendidas y valor monetario del stock.",
        icono: "📦"
    },
    "4": {
        titulo: "Estado de Órdenes",
        descripcion: "Distribución de pedidos por estado (pendiente, completado, etc.) con montos acumulados.",
        icono: "🛒"
    },
    "5": {
        titulo: "Ventas Diarias",
        descripcion: "Histórico de ventas día a día: total de órdenes, ventas totales y ticket promedio.",
        icono: "📈"
    }
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ReportePage({ params }: PageProps) {
    const { id } = await params;

    if (!["1", "2", "3", "4", "5"].includes(id)) {
        notFound();
    }

    const info = reportesInfo[id];

    const renderVista = () => {
        switch (id) {
            case "1": return <Vista1 />;
            case "2": return <Vista2 />;
            case "3": return <Vista3 />;
            case "4": return <Vista4 />;
            case "5": return <Vista5 />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation */}
                <nav className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al Dashboard
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{info.icono}</span>
                        <div>
                            <p className="text-slate-500 text-sm font-mono mb-1">REPORTE #{id} • VIEW_{id}</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                {info.titulo}
                            </h1>
                        </div>
                    </div>
                    <p className="text-slate-400 text-lg max-w-3xl">
                        {info.descripcion}
                    </p>
                </header>

                {/* Report Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <Link
                            key={num}
                            href={`/reports/${num}`}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${id === String(num)
                                    ? "bg-white text-slate-900"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            Reporte {num}
                        </Link>
                    ))}
                </div>

                {/* Vista Content */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                    {renderVista()}
                </div>
            </div>
        </div>
    );
}
