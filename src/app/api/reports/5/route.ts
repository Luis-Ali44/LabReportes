import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/app/lib/db";

const querySchema = z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            limit: searchParams.get("limit") ?? 10,
            offset: searchParams.get("offset") ?? 0,
            fecha_inicio: searchParams.get("fecha_inicio") || undefined,
            fecha_fin: searchParams.get("fecha_fin") || undefined,
        });

        let query: string;
        const values: (number | string)[] = [];
        let paramIndex = 1;

        const conditions: string[] = [];

        if (params.fecha_inicio) {
            conditions.push(`fecha_venta >= $${paramIndex}`);
            values.push(params.fecha_inicio);
            paramIndex++;
        }

        if (params.fecha_fin) {
            conditions.push(`fecha_venta <= $${paramIndex}`);
            values.push(params.fecha_fin);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        query = `SELECT fecha_venta, total_ordenes, ventas_totales, ticket_promedio 
             FROM view_ventas_diarias 
             ${whereClause}
             ORDER BY fecha_venta DESC 
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

        values.push(params.limit, params.offset);

        const result = await pool.query(query, values);

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error("Error en reporte 5:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
