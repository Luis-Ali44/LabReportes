import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/app/lib/db";

const querySchema = z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),
    stock_min: z.coerce.number().min(0).optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            limit: searchParams.get("limit") ?? 10,
            offset: searchParams.get("offset") ?? 0,
            stock_min: searchParams.get("stock_min") || undefined,
        });

        let query: string;
        let values: (number | string)[];

        if (params.stock_min !== undefined) {
            query = `SELECT producto, stock_actual, total_vendido, valor_monetario_stock 
               FROM view_analisis_productos 
               WHERE stock_actual >= $1
               ORDER BY valor_monetario_stock DESC 
               LIMIT $2 OFFSET $3`;
            values = [params.stock_min, params.limit, params.offset];
        } else {
            query = `SELECT producto, stock_actual, total_vendido, valor_monetario_stock 
               FROM view_analisis_productos 
               ORDER BY valor_monetario_stock DESC 
               LIMIT $1 OFFSET $2`;
            values = [params.limit, params.offset];
        }

        const result = await pool.query(query, values);

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error("Error en reporte 3:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
