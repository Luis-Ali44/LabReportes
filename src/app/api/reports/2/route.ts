import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/app/lib/db";

const estatusValidos = ["Ganancias Altas", "Ganancias Normales"] as const;

const querySchema = z.object({
    estatus: z.enum(estatusValidos).optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            estatus: searchParams.get("estatus") || undefined,
        });

        let query = `SELECT categoria, ingresos_totales, estatus_negocio 
                 FROM view_categorias_top 
                 ORDER BY ingresos_totales DESC`;
        const values: string[] = [];

        if (params.estatus) {
            query = `SELECT categoria, ingresos_totales, estatus_negocio 
               FROM view_categorias_top 
               WHERE estatus_negocio = $1
               ORDER BY ingresos_totales DESC`;
            values.push(params.estatus);
        }

        const result = await pool.query(query, values);

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error("Error en reporte 2:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
