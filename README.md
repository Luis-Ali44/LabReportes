# Lab Reportes  

**Materia:** Base de Datos Avanzadas  
**Actividad:** Lab Reportes - Dashboard con Next.js  
**Autor:** Luis Ali  

---

## Descripción  

Dashboard para visualizar reportes SQL. Usa Next.js en el frontend y PostgreSQL con 5 views en el backend. Todo corre con Docker Compose.

---

## Cómo ejecutar  

    git clone https://github.com/Luis-Ali44/Lab_Reportes.git
    cd Lab_Reportes
    docker compose up --build

Abrir en el navegador:  

http://localhost:3001  

---

## Arquitectura  

Frontend: Next.js  
Backend: API Routes de Next.js  
Base de Datos: PostgreSQL 16  
Contenedores: Docker Compose  

Los reportes están implementados como Views en SQL para que la lógica de agregaciones y métricas se ejecute directamente en la base de datos.

---

## Reportes Implementados  

1. **Top Clientes:** Usa `RANK()` (Window Functions)  
2. **Categorías Top:** Usa `CASE` y `HAVING`  
3. **Análisis de Inventario:** Usa CTEs (`WITH`)  
4. **Estado de Órdenes:** Usa agregaciones  
5. **Ventas Diarias:** Agrupación por fecha (`DATE`)  

---

## Seguridad  

- Se utiliza un rol de aplicación con permisos mínimos.  
- La aplicación consulta únicamente las views y no las tablas directamente.  
- Todas las consultas usan Query Parameterization (`$1`, `$2`, etc.).  
- Se valida la entrada de datos con Zod para evitar errores y posibles inyecciones.  

---

## Índices  

| Índice | Tabla | Columna | Por qué |
|--------|-------|---------|---------|
| idx_ordenes_usuario_id | ordenes | usuario_id | JOIN en view_top_users |
| idx_productos_categoria_id | productos | categoria_id | JOIN en view_categorias_top |
| idx_orden_detalles_producto_id | orden_detalles | producto_id | JOIN en view_analisis_productos |
| idx_ordenes_status | ordenes | status | GROUP BY en view_estado_ordenes |
| idx_ordenes_created_at | ordenes | created_at | GROUP BY DATE en view_ventas_diarias |

 
En teoría es más rápido porque en lugar de leer toda la tabla buscando, por ejemplo, el id de un usuario, el motor puede ir directamente al índice. Sin embargo, como las tablas son pequeñas, PostgreSQL puede decidir hacer un **Sequential Scan**, ya que el costo es menor. Esto es un comportamiento normal del optimizador.

---

## Decisiones de Diseño  

- Se decidió calcular métricas directamente en SQL mediante views para mejorar rendimiento y simplificar el backend.  
- Se usa paginación del lado del servidor con `LIMIT` y `OFFSET` para evitar enviar grandes volúmenes de datos al navegador.  

---


