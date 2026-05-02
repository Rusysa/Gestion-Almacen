# Gestion de Almacen API

## Creditos

### Integrantes
Rudy Saldana Merenciano
Angel Emilio Martinez Camacho

### Materia 
Desarrollo de aplicaciones con bases de datos

### Profesor
Jesus Alejandro Flores Hernandez

API REST sencilla con Express y SQLite (better-sqlite3) para gestionar compras, ventas e inventario. No incluye frontend. Los endpoints se prueban con curl.

## Requisitos

- Node.js 18+ (recomendado)

## Instalacion

```bash
npm install
```

## Poblar la base de datos

Esto crea las tablas y agrega 10 registros por tabla.

```bash
npm run poblar
```

## Ejecutar el servidor

```bash
npm run dev
```

El servidor usa `PORT` desde `.env` (por defecto 3000).

## Estructura del proyecto

```
Database/
  app.db
  db.js
routes/
  helpers.js
  index.js
scripts/
  poblar.js
server.js
```

## Endpoints

Base URL: `http://localhost:3000`

### Categorias

```bash
curl -s http://localhost:3000/api/categorias
curl -s http://localhost:3000/api/categorias/1
curl -s -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Snacks","descripcion":"Snacks salados","activo":1}'
curl -s -X PUT http://localhost:3000/api/categorias/1 \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Actualizado","activo":1}'
curl -s -X DELETE http://localhost:3000/api/categorias/1
```

### Articulos

```bash
curl -s http://localhost:3000/api/articulos
curl -s http://localhost:3000/api/articulos/1
curl -s -X POST http://localhost:3000/api/articulos \
  -H "Content-Type: application/json" \
  -d '{"categoria_id":1,"codigo":"Z-900","nombre":"Mouse","precio_venta":60.5,"stock":40,"descripcion":"Mouse optico","imagen":"mouse.png","activo":1}'
curl -s -X PUT http://localhost:3000/api/articulos/1 \
  -H "Content-Type: application/json" \
  -d '{"stock":45,"precio_venta":62.0}'
curl -s -X DELETE http://localhost:3000/api/articulos/1
```

### Roles

```bash
curl -s http://localhost:3000/api/roles
curl -s http://localhost:3000/api/roles/1
curl -s -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Logistica","descripcion":"Gestion logistica"}'
curl -s -X PUT http://localhost:3000/api/roles/1 \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Acceso total"}'
curl -s -X DELETE http://localhost:3000/api/roles/1
```

### Usuarios

```bash
curl -s http://localhost:3000/api/usuarios
curl -s http://localhost:3000/api/usuarios/1
curl -s -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"rol_id":1,"nombre":"Nuevo Usuario","tipo_documento":"DNI","num_documento":"600000099","direccion":"Calle 99","telefono":"900999999","email":"nuevo@demo.com","clave":"clave","activo":1}'
curl -s -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"telefono":"900888777"}'
curl -s -X DELETE http://localhost:3000/api/usuarios/1
```

### Personas

```bash
curl -s http://localhost:3000/api/personas
curl -s http://localhost:3000/api/personas/1
curl -s -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{"tipo_persona":"Cliente","nombre":"Cliente Nuevo","tipo_documento":"DNI","num_documento":"700000099","direccion":"Calle 99","telefono":"988999999","email":"cliente.nuevo@demo.com","activo":1}'
curl -s -X PUT http://localhost:3000/api/personas/1 \
  -H "Content-Type: application/json" \
  -d '{"direccion":"Calle 100"}'
curl -s -X DELETE http://localhost:3000/api/personas/1
```

### Ingresos

```bash
curl -s http://localhost:3000/api/ingresos
curl -s http://localhost:3000/api/ingresos/1
curl -s -X POST http://localhost:3000/api/ingresos \
  -H "Content-Type: application/json" \
  -d '{"persona_id":1,"usuario_id":1,"tipo_comprobante":"Factura","serie_comprobante":"F010","num_comprobante":"0101","fecha":"2024-04-01","impuesto":18,"total":900,"estado":"Aceptado"}'
curl -s -X PUT http://localhost:3000/api/ingresos/1 \
  -H "Content-Type: application/json" \
  -d '{"total":950}'
curl -s -X DELETE http://localhost:3000/api/ingresos/1
```

### Detalle Ingresos

```bash
curl -s http://localhost:3000/api/detalle-ingresos
curl -s http://localhost:3000/api/detalle-ingresos/1
curl -s -X POST http://localhost:3000/api/detalle-ingresos \
  -H "Content-Type: application/json" \
  -d '{"ingreso_id":1,"articulo_id":1,"cantidad":3,"precio":4000}'
curl -s -X PUT http://localhost:3000/api/detalle-ingresos/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidad":4}'
curl -s -X DELETE http://localhost:3000/api/detalle-ingresos/1
```

### Ventas

```bash
curl -s http://localhost:3000/api/ventas
curl -s http://localhost:3000/api/ventas/1
curl -s -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{"persona_id":6,"usuario_id":2,"tipo_comprobante":"Boleta","serie_comprobante":"B200","num_comprobante":"3001","fecha":"2024-04-02","impuesto":18,"total":250,"estado":"Aceptado"}'
curl -s -X PUT http://localhost:3000/api/ventas/1 \
  -H "Content-Type: application/json" \
  -d '{"total":275}'
curl -s -X DELETE http://localhost:3000/api/ventas/1
```

### Detalle Ventas

```bash
curl -s http://localhost:3000/api/detalle-ventas
curl -s http://localhost:3000/api/detalle-ventas/1
curl -s -X POST http://localhost:3000/api/detalle-ventas \
  -H "Content-Type: application/json" \
  -d '{"venta_id":1,"articulo_id":1,"cantidad":1,"precio":4500.5,"descuento":0}'
curl -s -X PUT http://localhost:3000/api/detalle-ventas/1 \
  -H "Content-Type: application/json" \
  -d '{"descuento":5}'
curl -s -X DELETE http://localhost:3000/api/detalle-ventas/1
```

## Notas

- Para evitar errores de llaves foraneas, primero crea registros en tablas base (categoria, rol, persona, usuario, articulo) antes de insertar en ingresos/ventas y sus detalles.
- Si deseas reiniciar datos de prueba, ejecuta nuevamente `npm run poblar`.
