import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/app/lib/db";

const querySchema = z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            limit: searchParams.get("limit") ?? 10,
            offset: searchParams.get("offset") ?? 0,
        });

        const result = await pool.query(
            `SELECT usuarios, total_ordenes, total_gasto, posicion, ticket_promedio 
       FROM view_top_users 
       ORDER BY posicion ASC 
       LIMIT $1 OFFSET $2`,
            [params.limit, params.offset]
        );

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error("Error en reporte 1:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
