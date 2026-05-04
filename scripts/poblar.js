import db from "../Database/db.js";

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      activo INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS articulo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_id INTEGER NOT NULL,
      codigo TEXT,
      nombre TEXT NOT NULL UNIQUE,
      precio_venta REAL NOT NULL,
      stock INTEGER NOT NULL,
      descripcion TEXT,
      imagen TEXT,
      activo INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (categoria_id) REFERENCES categoria (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rol (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rol_id INTEGER NOT NULL,
      nombre TEXT NOT NULL UNIQUE,
      tipo_documento TEXT,
      num_documento TEXT,
      direccion TEXT,
      telefono TEXT,
      email TEXT NOT NULL UNIQUE,
      clave TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (rol_id) REFERENCES rol (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS persona (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo_persona TEXT NOT NULL,
      nombre TEXT NOT NULL UNIQUE,
      tipo_documento TEXT,
      num_documento TEXT,
      direccion TEXT,
      telefono TEXT,
      email TEXT UNIQUE,
      activo INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS ingreso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      persona_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      tipo_comprobante TEXT NOT NULL,
      serie_comprobante TEXT,
      num_comprobante TEXT NOT NULL,
      fecha TEXT NOT NULL,
      impuesto REAL NOT NULL,
      total REAL NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Aceptado',
      FOREIGN KEY (persona_id) REFERENCES persona (id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS detalle_ingreso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ingreso_id INTEGER NOT NULL,
      articulo_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      FOREIGN KEY (ingreso_id) REFERENCES ingreso (id) ON DELETE CASCADE,
      FOREIGN KEY (articulo_id) REFERENCES articulo (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS venta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      persona_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      tipo_comprobante TEXT NOT NULL,
      serie_comprobante TEXT,
      num_comprobante TEXT NOT NULL,
      fecha TEXT NOT NULL,
      impuesto REAL NOT NULL,
      total REAL NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Aceptado',
      FOREIGN KEY (persona_id) REFERENCES persona (id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS detalle_venta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER NOT NULL,
      articulo_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      descuento REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES venta (id) ON DELETE CASCADE,
      FOREIGN KEY (articulo_id) REFERENCES articulo (id) ON DELETE CASCADE
    );
  `);
};

const clearTables = () => {
  db.exec(`
    DELETE FROM detalle_venta;
    DELETE FROM venta;
    DELETE FROM detalle_ingreso;
    DELETE FROM ingreso;
    DELETE FROM articulo;
    DELETE FROM categoria;
    DELETE FROM usuario;
    DELETE FROM rol;
    DELETE FROM persona;
  `);
};

const run = () => {
  createTables();
  
  const checkData = db.prepare("SELECT COUNT(*) as count FROM categoria").get();
  if (checkData && checkData.count > 0) {
    console.log("La base de datos ya contiene datos. Omitiendo la poblacion inicial.");
    return;
  }

  clearTables();

  const insertCategoria = db.prepare(
    "INSERT INTO categoria (nombre, descripcion, activo) VALUES (?, ?, ?)"
  );
  const insertArticulo = db.prepare(
    "INSERT INTO articulo (categoria_id, codigo, nombre, precio_venta, stock, descripcion, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertRol = db.prepare(
    "INSERT INTO rol (nombre, descripcion) VALUES (?, ?)"
  );
  const insertUsuario = db.prepare(
    "INSERT INTO usuario (rol_id, nombre, tipo_documento, num_documento, direccion, telefono, email, clave, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertPersona = db.prepare(
    "INSERT INTO persona (tipo_persona, nombre, tipo_documento, num_documento, direccion, telefono, email, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertIngreso = db.prepare(
    "INSERT INTO ingreso (persona_id, usuario_id, tipo_comprobante, serie_comprobante, num_comprobante, fecha, impuesto, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertDetalleIngreso = db.prepare(
    "INSERT INTO detalle_ingreso (ingreso_id, articulo_id, cantidad, precio) VALUES (?, ?, ?, ?)"
  );
  const insertVenta = db.prepare(
    "INSERT INTO venta (persona_id, usuario_id, tipo_comprobante, serie_comprobante, num_comprobante, fecha, impuesto, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertDetalleVenta = db.prepare(
    "INSERT INTO detalle_venta (venta_id, articulo_id, cantidad, precio, descuento) VALUES (?, ?, ?, ?, ?)"
  );

  const categorias = [
    ["Electronicos", "Dispositivos y gadgets", 1],
    ["Alimentos", "Productos de consumo diario", 1],
    ["Bebidas", "Bebidas sin alcohol", 1],
    ["Herramientas", "Herramientas manuales", 1],
    ["Accesorios", "Accesorios diversos", 1],
    ["Hogar", "Articulos para el hogar", 1],
    ["Limpieza", "Productos de limpieza", 1],
    ["Papeleria", "Suministros de oficina", 1],
    ["Cuidado Personal", "Higiene y cuidado", 1],
    ["Ferreteria", "Productos de ferreteria", 1],
  ];

  const roles = [
    ["Administrador", "Acceso total"],
    ["Vendedor", "Gestion de ventas"],
    ["Almacenero", "Control de inventario"],
    ["Comprador", "Gestion de compras"],
    ["Supervisor", "Supervision general"],
    ["Analista", "Analisis de datos"],
    ["Soporte", "Soporte interno"],
    ["Auditor", "Revision de procesos"],
    ["Operador", "Operaciones diarias"],
    ["Invitado", "Acceso limitado"],
  ];

  const personas = [
    ["Proveedor", "Distribuidora Norte", "RUC", "900000001", "Av. Norte 123", "900111222", "proveedor1@demo.com", 1],
    ["Proveedor", "Comercial Andina", "RUC", "900000002", "Jr. Andes 456", "900111223", "proveedor2@demo.com", 1],
    ["Proveedor", "Servicios Pacifico", "RUC", "900000003", "Av. Pacifico 789", "900111224", "proveedor3@demo.com", 1],
    ["Proveedor", "Importaciones Sur", "RUC", "900000004", "Av. Sur 321", "900111225", "proveedor4@demo.com", 1],
    ["Proveedor", "Mercantil Central", "RUC", "900000005", "Calle Central 100", "900111226", "proveedor5@demo.com", 1],
    ["Cliente", "Cliente Uno", "DNI", "700000001", "Calle 1", "988000001", "cliente1@demo.com", 1],
    ["Cliente", "Cliente Dos", "DNI", "700000002", "Calle 2", "988000002", "cliente2@demo.com", 1],
    ["Cliente", "Cliente Tres", "DNI", "700000003", "Calle 3", "988000003", "cliente3@demo.com", 1],
    ["Cliente", "Cliente Cuatro", "DNI", "700000004", "Calle 4", "988000004", "cliente4@demo.com", 1],
    ["Cliente", "Cliente Cinco", "DNI", "700000005", "Calle 5", "988000005", "cliente5@demo.com", 1],
  ];

  const usuarios = [
    [1, "Rudy Saldana", "DNI", "600000001", "Av. Siempre Viva 123", "900222111", "rudy@demo.com", "clave1", 1],
    [2, "Ana Perez", "DNI", "600000002", "Jr. Lima 456", "900222112", "ana@demo.com", "clave2", 1],
    [3, "Luis Gomez", "DNI", "600000003", "Av. Arequipa 789", "900222113", "luis@demo.com", "clave3", 1],
    [4, "Carla Diaz", "DNI", "600000004", "Calle 10", "900222114", "carla@demo.com", "clave4", 1],
    [5, "Marco Ruiz", "DNI", "600000005", "Calle 11", "900222115", "marco@demo.com", "clave5", 1],
    [6, "Lucia Vega", "DNI", "600000006", "Calle 12", "900222116", "lucia@demo.com", "clave6", 1],
    [7, "Diego Soto", "DNI", "600000007", "Calle 13", "900222117", "diego@demo.com", "clave7", 1],
    [8, "Marta Leon", "DNI", "600000008", "Calle 14", "900222118", "marta@demo.com", "clave8", 1],
    [9, "Jose Rojas", "DNI", "600000009", "Calle 15", "900222119", "jose@demo.com", "clave9", 1],
    [10, "Paula Torres", "DNI", "600000010", "Calle 16", "900222120", "paula@demo.com", "clave10", 1],
  ];

  const articulos = [
    [1, "A-100", "Laptop Pro", 4500.5, 20, "Laptop para oficina", "laptop.png", 1],
    [1, "A-101", "Tablet Mini", 1200.0, 30, "Tablet compacta", "tablet.png", 1],
    [2, "B-200", "Arroz Premium", 15.9, 200, "Arroz extra", "arroz.png", 1],
    [2, "B-201", "Azucar Blanca", 8.5, 180, "Azucar refinada", "azucar.png", 1],
    [3, "C-300", "Agua Mineral", 2.5, 500, "Botella 600ml", "agua.png", 1],
    [4, "D-400", "Martillo", 35.0, 60, "Martillo acero", "martillo.png", 1],
    [5, "E-500", "Cable USB", 12.0, 150, "Cable tipo C", "usb.png", 1],
    [6, "F-600", "Lampara LED", 25.0, 90, "Lampara blanca", "lampara.png", 1],
    [7, "G-700", "Detergente", 18.5, 120, "Detergente liquido", "detergente.png", 1],
    [8, "H-800", "Cuaderno", 6.0, 300, "Cuaderno A4", "cuaderno.png", 1],
  ];

  const ingresos = [
    [1, 1, "Factura", "F001", "0001", "2024-01-10", 18.0, 1200.5, "Aceptado"],
    [2, 2, "Factura", "F001", "0002", "2024-01-12", 18.0, 980.0, "Aceptado"],
    [3, 3, "Boleta", "B001", "0003", "2024-01-15", 18.0, 760.0, "Aceptado"],
    [4, 4, "Factura", "F002", "0004", "2024-01-20", 18.0, 1500.0, "Aceptado"],
    [5, 5, "Ticket", "T001", "0005", "2024-01-22", 18.0, 600.0, "Aceptado"],
    [1, 6, "Factura", "F002", "0006", "2024-01-25", 18.0, 820.0, "Aceptado"],
    [2, 7, "Boleta", "B001", "0007", "2024-01-28", 18.0, 430.0, "Aceptado"],
    [3, 8, "Factura", "F003", "0008", "2024-02-01", 18.0, 910.0, "Aceptado"],
    [4, 9, "Ticket", "T002", "0009", "2024-02-05", 18.0, 540.0, "Aceptado"],
    [5, 10, "Factura", "F003", "0010", "2024-02-08", 18.0, 1100.0, "Aceptado"],
  ];

  const detalleIngresos = [
    [1, 1, 5, 4000.0],
    [2, 2, 10, 1100.0],
    [3, 3, 50, 14.0],
    [4, 4, 60, 7.5],
    [5, 5, 100, 2.0],
    [6, 6, 20, 30.0],
    [7, 7, 80, 10.0],
    [8, 8, 40, 20.0],
    [9, 9, 30, 15.0],
    [10, 10, 100, 5.0],
  ];

  const ventas = [
    [6, 2, "Boleta", "B100", "2001", "2024-02-10", 18.0, 120.0, "Aceptado"],
    [7, 3, "Boleta", "B100", "2002", "2024-02-12", 18.0, 240.0, "Aceptado"],
    [8, 4, "Factura", "F200", "2003", "2024-02-15", 18.0, 330.0, "Aceptado"],
    [9, 5, "Ticket", "T300", "2004", "2024-02-18", 18.0, 80.0, "Aceptado"],
    [10, 6, "Boleta", "B101", "2005", "2024-02-20", 18.0, 150.0, "Aceptado"],
    [6, 7, "Factura", "F201", "2006", "2024-02-21", 18.0, 210.0, "Aceptado"],
    [7, 8, "Boleta", "B101", "2007", "2024-02-23", 18.0, 95.0, "Aceptado"],
    [8, 9, "Ticket", "T301", "2008", "2024-02-25", 18.0, 130.0, "Aceptado"],
    [9, 10, "Factura", "F202", "2009", "2024-02-27", 18.0, 260.0, "Aceptado"],
    [10, 1, "Boleta", "B102", "2010", "2024-03-01", 18.0, 175.0, "Aceptado"],
  ];

  const detalleVentas = [
    [1, 1, 1, 4500.5, 0.0],
    [2, 2, 2, 1200.0, 10.0],
    [3, 3, 10, 15.9, 0.0],
    [4, 4, 12, 8.5, 0.0],
    [5, 5, 20, 2.5, 0.0],
    [6, 6, 1, 35.0, 0.0],
    [7, 7, 3, 12.0, 0.0],
    [8, 8, 2, 25.0, 0.0],
    [9, 9, 5, 18.5, 0.0],
    [10, 10, 4, 6.0, 0.0],
  ];

  const transaction = db.transaction(() => {
    categorias.forEach((row) => insertCategoria.run(row));
    roles.forEach((row) => insertRol.run(row));
    personas.forEach((row) => insertPersona.run(row));
    usuarios.forEach((row) => insertUsuario.run(row));
    articulos.forEach((row) => insertArticulo.run(row));
    ingresos.forEach((row) => insertIngreso.run(row));
    detalleIngresos.forEach((row) => insertDetalleIngreso.run(row));
    ventas.forEach((row) => insertVenta.run(row));
    detalleVentas.forEach((row) => insertDetalleVenta.run(row));
  });

  transaction();
  console.log("Base de datos poblada con 10 registros por tabla.");
};

run();
