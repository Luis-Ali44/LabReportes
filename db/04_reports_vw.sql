--View 1

-- Qué devuelve: Los Clientes que más han gastado
-- Grain: Un Usuario
-- Métricas: Gasto total, promedio por orden, posición en el ranking
-- Por qué usa GROUP BY/HAVING: GRUPO para juntar todas las ordenes en un mismo usuario




CREATE OR REPLACE VIEW view_top_users AS SELECT
u.nombre AS usuarios,
COUNT(o.id) AS Total_Ordenes,
SUM(o.total) AS Total_Gasto,

RANK() OVER(ORDER BY SUM(o.total) DESC) AS posicion,
COALESCE(ROUND(AVG(o.total), 2 ),0) AS Ticket_Promedio
FROM usuarios u
LEFT JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre;

-- VERIFY: SELECT * FROM view_top_users WHERE posicion <= 3;



--View 2

--Qué devuelve: Ingresos totales por cada categoria
--Grain: Una categoría.
--Métricas: Ingresos totales, clasificación segun los ingresos
--Por qué HAVING: Para mostrar solo categorías que han generado dinero.

CREATE OR REPLACE VIEW view_categorias_top AS
SELECT 
    c.nombre AS categoria,
    SUM(od.subtotal) AS ingresos_totales,
    -- CAMPO CALCULADO: Un texto amigable dependiendo del dinero ganado
    CASE 
        WHEN SUM(od.subtotal) > 1000 THEN 'Ganancias Altas'
        ELSE 'Ganancias Normales'
    END AS estatus_negocio
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY c.id, c.nombre
HAVING SUM(od.subtotal) > 0;

-- VERIFY: SELECT * FROM view_categorias_top ORDER BY ingresos_totales DESC;


--View 3

--Qué devuelve: Productos con su nivel de inventario y relevancia en ventas.
--Grain: Un producto.
--Métricas: Stock, Total vendido, Valor de inventario.
--Por qué CTE: Para separar el cálculo de ventas de la información de producto.

CREATE OR REPLACE VIEW view_analisis_productos AS
WITH ventas_producto AS (
    SELECT 
        producto_id, 
        SUM(cantidad) as unidades_vendidas
    FROM orden_detalles
    GROUP BY producto_id
)
SELECT 
    p.nombre AS producto,
    p.stock AS stock_actual,
    COALESCE(vp.unidades_vendidas, 0) AS total_vendido,
    (p.stock * p.precio) AS valor_monetario_stock
FROM productos p
LEFT JOIN ventas_producto vp ON p.id = vp.producto_id;

-- VERIFY: SELECT * FROM view_analisis_productos WHERE stock_actual < 50;


--View 4

--Qué devuelve: Cuántas órdenes hay por estado y su valor acumulado.
--Grain: Un estado
--Métricas: Cantidad de órdenes, Monto pagado
--Uso de HAVING: Filtra estados con menos de 1 orden

CREATE OR REPLACE VIEW view_estado_ordenes AS
SELECT 
    status,
    COUNT(id) AS cantidad_pedidos,
    SUM(total) AS monto_acumulado,
    ROUND(AVG(total), 2) AS promedio_orden
FROM ordenes
GROUP BY status
HAVING COUNT(id) >= 1;

-- VERIFY: SELECT * FROM view_estado_ordenes ORDER BY cantidad_pedidos DESC;


--View 5

--Qué devuelve:  ventas por día.
--Grain: Un día.
--Métricas: Total de órdenes, ventas del día, ticket promedio.
--Uso de group: Se usa para agrupar ordenes por dia 


CREATE OR REPLACE VIEW view_ventas_diarias AS
SELECT
    DATE(o.created_at) AS fecha_venta,
    COUNT(o.id) AS total_ordenes,
    SUM(o.total) AS ventas_totales,
    ROUND(AVG(o.total), 2) AS ticket_promedio
FROM ordenes o
GROUP BY DATE(o.created_at);

-- VERIFY: SELECT * FROM view_ventas_diarias ORDER BY fecha_venta DESC LIMIT 7;


