import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT status, cantidad_pedidos, monto_acumulado, promedio_orden 
       FROM view_estado_ordenes 
       ORDER BY cantidad_pedidos DESC`
        );

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error("Error en reporte 4:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
