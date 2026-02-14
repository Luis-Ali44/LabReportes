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
        descripcion: "Ranking de clientes por gasto total.",
        icono: "TC"
    },
    "2": {
        titulo: "Categorías Top",
        descripcion: "Ingresos totales por categoría.",
        icono: "CT"
    },
    "3": {
        titulo: "Análisis de Productos",
        descripcion: "Inventario actual de productos.",
        icono: "AP"
    },
    "4": {
        titulo: "Estado de Órdenes",
        descripcion: "Distribución de pedidos por estado.",
        icono: "EO"
    },
    "5": {
        titulo: "Ventas Diarias",
        descripcion: "Histórico de ventas diarias.",
        icono: "VD"
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
        <div className="min-h-screen bg-slate-100 font-sans">
            <nav className="bg-slate-900 text-white p-4 shadow-md mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="font-bold hover:underline">
                        &larr; Volver al Dashboard
                    </Link>
                    <span className="text-sm text-slate-400">Sistema de Reportes</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pb-12">
                <header className="mb-8 bg-white p-6 rounded border border-slate-300">
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {info.titulo}
                        </h1>
                        <p className="text-slate-500 text-sm font-mono">REPORTE #{id}</p>
                    </div>
                    <p className="text-slate-600 border-t border-slate-200 mt-4 pt-4">
                        {info.descripcion}
                    </p>
                </header>

                <div className="flex flex-wrap gap-2 mb-6">
                    {["1", "2", "3", "4", "5"].map((num) => (
                        <Link
                            key={num}
                            href={`/reports/${num}`}
                            className={`px-4 py-2 text-sm rounded border transition-colors ${id === num
                                ? "bg-slate-800 text-white border-slate-800"
                                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            Reporte {num}
                        </Link>
                    ))}
                </div>

                <div className="bg-white border border-slate-300 rounded p-6 shadow-sm">
                    {renderVista()}
                </div>
            </div>
        </div>
    );
}
