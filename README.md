
# Lab Reportes: Next.js + PostgreSQL Dashboard

Este proyecto es un dashboard de reportes para una tienda en línea, construido con **Next.js 14 (App Router)** y **PostgreSQL**, totalmente contenerizado con **Docker Compose**.

## Cómo ejecutar

El proyecto está diseñado para levantarse con un solo comando:

```bash
docker compose up --build
docker compose up --build
```

### Configuración Previa

El repositorio incluye un archivo `.env.example`. Para ejecutar el proyecto localmente, asegúrate de crear el archivo `.env`:

```bash
cp .env.example .env
```

Esto iniciará:
1. **Base de datos (PostgreSQL 16)** en el puerto `5434`.
2. **Aplicación Web (Next.js)** en el puerto `3001` (http://localhost:3001).

La base de datos se inicializa automáticamente con:
- Tablas (`db/01_schema.sql`)
- Datos semilla (`db/02_seed.sql`)
- Views (`db/04_reports_vw.sql`)
- Índices (`db/05_indexes.sql`)
- Roles y seguridad (`db/06_roles.sql`)

## Modelo de Amenazas y Seguridad

Para cumplir con los requisitos de seguridad ("no conectar como postgres", "consultas seguras"), se implementaron las siguientes medidas:

1. **Rol de Aplicación con Permisos Mínimos (`roles.sql`)**:
   - Se creó el usuario `user_app`.
   - Se revocaron todos los permisos sobre las tablas `public`.
   - Se otorgó permiso `SELECT` **exclusivamente** sobre las 5 Views. La aplicación no puede leer tablas crudas ni modificar datos.

2. **Prevención de SQL Injection**:
   - Todas las consultas en los API Routes (`src/app/api/reports/*`) utilizan **Query Parameterization** (`$1`, `$2`, etc.) a través de la librería `pg`. Nunca se concatenan strings con inputs del usuario.

3. **Validación de Entradas (Zod)**:
   - Se utiliza `zod` en el backend para validar y tipar estrictamente los parámetros de URL (filtros, paginación). Si un parámetro no es válido (ej. texto en lugar de número), la API rechaza la petición.

## Trade-offs y Decisiones de Diseño

*   **Logic in Database (Views) vs. Logic in App**:
    *   *Decisión*: Calculé métricas como promedios y rankings directamente en SQL (Views).
    *   *Por qué*: Es más rápido que traer todos los datos a Next.js y calcularlo ahí. Además, simplifica el código del backend a solo hacer `SELECT *`.

*   **Server-Side Pagination vs. Client-Side**:
    *   *Decisión*: Usé `LIMIT` y `OFFSET` en SQL para los reportes grandes.
    *   *Por qué*: Si la tabla crece a 10,000 registros, el navegador se trabaría si envío todo.

## Evidencia de Performance (Índices)

Se agregaron índices en `db/indexes.sql` para mejorar los JOINs y filtros:

**View 1 (`view_top_users`)**:
- Index en `ordenes(usuario_id)`: Ayuda a que el JOIN con la tabla de usuarios sea rápido al buscar las órdenes de cada uno.

**View 5 (`view_ventas_diarias`)**:
- Index en `ordenes(created_at)`: Acelera el agrupamiento por fechas.

## Bitácora de IA

Para este laboratorio usé IA (ChatGPT/Claude) principalmente para:

1.  **Datos de prueba**: Le pedí generar el archivo `seed.sql` con 50 usuarios y órdenes random para no tener que escribirlos a mano.
2.  **Sintaxis SQL**: Consulté cómo se escribía correctamente el `RANK() OVER` y las sintaxis de las CTE porque me marcaba error de sintaxis.
3.  **UI**: Me ayudó a limpiar los estilos de Tailwind para que se viera más ordenado sin tener que escribir todo el CSS desde cero.
4.  **Docker**: Tuve problemas con los puertos ocupados (5432 y 3000) y me sugirió cambiarlos a 5434 y 3001 en el `docker-compose.yml`.

### Links a Reportes Implementados

1.  **Top Clientes** (`/reports/1`): Usa Window Functions (`RANK`).
2.  **Categorías Top** (`/reports/2`): Usa `CASE` y `HAVING`.
3.  **Analisis Inventario** (`/reports/3`): Usa CTEs (`WITH`) y campos calculados.
4.  **Estado de Órdenes** (`/reports/4`): Usa agregaciones simples.
5.  **Ventas Diarias** (`/reports/5`): Usa agrupamiento por fechas.
=======
# Lab Reportes

**Materia:** Base de Datos Avanzadas  
**Actividad:** Lab Reportes - Dashboard con Next.js  
**Autor:** Luis Ali  

---

## Descripción

Dashboard para visualizar reportes SQL. Usa Next.js en el frontend y PostgreSQL con 5 views en el backend. Todo corre con Docker Compose.



## Cómo ejecutar

```bash
git clone https://github.com/Luis-Ali44/Lab_Reportes.git
cd Lab_Reportes
docker compose up --build
```

Abrir **http://localhost:3000**



## Índices

| Índice | Tabla | Columna | Por qué |
|--------|-------|---------|---------|
| `idx_ordenes_usuario_id` | ordenes | usuario_id | JOIN en view_top_users |
| `idx_productos_categoria_id` | productos | categoria_id | JOIN en view_categorias_top |
| `idx_orden_detalles_producto_id` | orden_detalles | producto_id | JOIN en view_analisis_productos |
| `idx_ordenes_status` | ordenes | status | GROUP BY en view_estado_ordenes |
| `idx_ordenes_created_at` | ordenes | created_at | GROUP BY DATE en view_ventas_diarias |

 
En teoria es mas rapido por que en lugar de leer toda la tabla buscadno por ejemplo el id de un usuario, debeira de ir directo si ya conoce su id 
pero al ser una tabla muy pequeña, la base decide leer toda la tabla

