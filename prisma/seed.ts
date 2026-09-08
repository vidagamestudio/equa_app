import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DAY = 24 * 60 * 60 * 1000;
const today = new Date();
today.setHours(0, 0, 0, 0);

function daysFromNow(n: number) {
  const d = new Date(today.getTime() + n * DAY);
  return d;
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.venta.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.clase.deleteMany();
  await prisma.abono.deleteMany();
  await prisma.compra.deleteMany();
  await prisma.gasto.deleteMany();
  await prisma.liquidacionProfesora.deleteMany();
  await prisma.alumna.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.profesora.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creando usuario admin...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: { email: "admin@estudioaire.com", name: "Admin", passwordHash },
  });

  console.log("Creando servicios...");
  const reformer = await prisma.servicio.create({
    data: { nombre: "Reformer", precio: 4200, cupo: 6, duracion: 50 },
  });
  const mat = await prisma.servicio.create({
    data: { nombre: "Mat", precio: 3200, cupo: 8, duracion: 50 },
  });
  const duo = await prisma.servicio.create({
    data: { nombre: "Duo Reformer", precio: 5800, cupo: 2, duracion: 50 },
  });
  const matEmbarazadas = await prisma.servicio.create({
    data: { nombre: "Mat embarazadas", precio: 3400, cupo: 6, duracion: 45 },
  });

  console.log("Creando profesoras...");
  const cande = await prisma.profesora.create({
    data: { nombre: "Cande", tarifaHora: 3500 },
  });
  const euge = await prisma.profesora.create({
    data: { nombre: "Euge", tarifaHora: 3500 },
  });
  const fran = await prisma.profesora.create({
    data: { nombre: "Fran", tarifaHora: 3500 },
  });

  console.log("Creando alumnas...");
  const rocio = await prisma.alumna.create({ data: { nombre: "Rocío Fernández", email: "rocio@mail.com" } });
  const marina = await prisma.alumna.create({ data: { nombre: "Marina Sosa", email: "marina@mail.com" } });
  const julieta = await prisma.alumna.create({ data: { nombre: "Julieta Paz", email: "julieta@mail.com" } });
  const ana = await prisma.alumna.create({ data: { nombre: "Ana Giménez", email: "ana@mail.com" } });
  const sole = await prisma.alumna.create({ data: { nombre: "Sole Duarte", email: "sole@mail.com" } });
  const vale = await prisma.alumna.create({ data: { nombre: "Vale Molina", email: "vale@mail.com" } });
  const laura = await prisma.alumna.create({ data: { nombre: "Laura Paredes", email: "laura@mail.com" } });
  const maria = await prisma.alumna.create({ data: { nombre: "María Ibáñez", email: "maria@mail.com" } });
  const cecilia = await prisma.alumna.create({ data: { nombre: "Cecilia Roldán", email: "cecilia@mail.com" } });
  const paula = await prisma.alumna.create({ data: { nombre: "Paula Vega", email: "paula@mail.com" } });

  const alumnas = [rocio, marina, julieta, ana, sole, vale, laura, maria, cecilia, paula];

  console.log("Creando abonos...");
  // Rocío - Ilimitado, al día
  await prisma.abono.create({
    data: {
      alumnaId: rocio.id, tipo: "Ilimitado mensual", precio: 38000,
      fechaInicio: daysFromNow(-20), fechaFin: daysFromNow(10), estado: "Al día",
    },
  });
  // Marina - Pack 8, quedan 2 clases, vence pronto
  await prisma.abono.create({
    data: {
      alumnaId: marina.id, tipo: "Pack 8", precio: 27600,
      fechaInicio: daysFromNow(-40), fechaFin: daysFromNow(5),
      clasesTotales: 8, clasesUsadas: 6, estado: "Vence pronto",
    },
  });
  // Julieta - Pack 4, vencido
  await prisma.abono.create({
    data: {
      alumnaId: julieta.id, tipo: "Pack 4", precio: 14800,
      fechaInicio: daysFromNow(-35), fechaFin: daysFromNow(-3),
      clasesTotales: 4, clasesUsadas: 1, estado: "Vencido",
    },
  });
  // Ana - Ilimitado, al día
  await prisma.abono.create({
    data: {
      alumnaId: ana.id, tipo: "Ilimitado mensual", precio: 38000,
      fechaInicio: daysFromNow(-15), fechaFin: daysFromNow(15), estado: "Al día",
    },
  });
  // Vale - Pack 8, al día
  await prisma.abono.create({
    data: {
      alumnaId: vale.id, tipo: "Pack 8", precio: 27600,
      fechaInicio: daysFromNow(-25), fechaFin: daysFromNow(20),
      clasesTotales: 8, clasesUsadas: 3, estado: "Al día",
    },
  });
  // Laura - Clase suelta, al día
  await prisma.abono.create({
    data: { alumnaId: laura.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-2), estado: "Al día" },
  });
  // María - Pack 8
  await prisma.abono.create({
    data: {
      alumnaId: maria.id, tipo: "Pack 8", precio: 27600,
      fechaInicio: daysFromNow(-10), fechaFin: daysFromNow(35),
      clasesTotales: 8, clasesUsadas: 1, estado: "Al día",
    },
  });
  // Cecilia - Pack 4
  await prisma.abono.create({
    data: {
      alumnaId: cecilia.id, tipo: "Pack 4", precio: 14800,
      fechaInicio: daysFromNow(-5), fechaFin: daysFromNow(25),
      clasesTotales: 4, clasesUsadas: 0, estado: "Al día",
    },
  });
  // Paula - Clase suelta
  await prisma.abono.create({
    data: { alumnaId: paula.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-1), estado: "Al día" },
  });
  // Sole - Clase suelta
  await prisma.abono.create({
    data: { alumnaId: sole.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-3), estado: "Al día" },
  });

  console.log("Creando clases de la semana...");
  // Clases programadas para los próximos 7 días (sin fines de semana)
  const clasesPorDia: { servicio: typeof mat; hora: string; profesora: typeof euge }[] = [
    { servicio: mat, hora: "17:00", profesora: euge },
    { servicio: reformer, hora: "18:30", profesora: fran },
    { servicio: mat, hora: "20:00", profesora: euge },
    { servicio: reformer, hora: "09:00", profesora: cande },
    { servicio: duo, hora: "10:30", profesora: cande },
    { servicio: matEmbarazadas, hora: "16:00", profesora: euge },
  ];

  const clases: { id: string; cupo: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const d = daysFromNow(i);
    if (isWeekend(d)) continue;
    for (const def of clasesPorDia) {
      const c = await prisma.clase.create({
        data: {
          fecha: d,
          horaInicio: def.hora,
          servicioId: def.servicio.id,
          profesoraId: def.profesora.id,
        },
      });
      clases.push({ id: c.id, cupo: def.servicio.cupo });
    }
  }

  console.log("Creando reservas...");
  for (const [idx, clase] of clases.entries()) {
    const num = Math.max(0, Math.min(clase.cupo, 2 + (idx % 7)));
    for (let r = 0; r < num; r++) {
      const alumna = alumnas[(idx + r) % alumnas.length];
      await prisma.reserva.create({
        data: { claseId: clase.id, alumnaId: alumna.id, estado: "Confirmada" },
      });
    }
  }

  console.log("Creando ventas...");
  await prisma.venta.create({
    data: { fecha: daysFromNow(-2), alumnaId: ana.id, concepto: "Ilimitado mensual", tipoComprobante: "Factura C", monto: 38000, medioPago: "Transferencia" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-3), alumnaId: vale.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Tarjeta" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-4), alumnaId: sole.id, concepto: "Clase suelta Mat", tipoComprobante: "Recibo", monto: 3200, medioPago: "Efectivo" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-6), alumnaId: marina.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Transferencia" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-8), alumnaId: julieta.id, concepto: "Pack 4 clases", tipoComprobante: "Factura C", monto: 14800, medioPago: "Efectivo" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-10), alumnaId: laura.id, concepto: "Clase suelta Reformer", tipoComprobante: "Recibo", monto: 4200, medioPago: "Efectivo" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-12), alumnaId: maria.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Transferencia" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-15), alumnaId: cecilia.id, concepto: "Pack 4 clases", tipoComprobante: "Factura C", monto: 14800, medioPago: "Transferencia" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-18), alumnaId: rocio.id, concepto: "Ilimitado mensual", tipoComprobante: "Factura C", monto: 38000, medioPago: "Tarjeta" },
  });
  await prisma.venta.create({
    data: { fecha: daysFromNow(-20), alumnaId: vale.id, concepto: "Clase suelta Duo Reformer", tipoComprobante: "Recibo", monto: 5800, medioPago: "Efectivo" },
  });

  console.log("Creando compras...");
  await prisma.compra.create({ data: { fecha: daysFromNow(-5), proveedor: "Fit Insumos SRL", concepto: "Bandas elásticas y pelotas", monto: 16400 } });
  await prisma.compra.create({ data: { fecha: daysFromNow(-10), proveedor: "Aguas del Sur", concepto: "Bidones de agua x10", monto: 9800 } });
  await prisma.compra.create({ data: { fecha: daysFromNow(-15), proveedor: "Distribuidora Pilates BA", concepto: "Aceite para rieles del reformer", monto: 6200 } });
  await prisma.compra.create({ data: { fecha: daysFromNow(-20), proveedor: "Textil Hogar", concepto: "Toallas para clase x20", monto: 5600 } });

  console.log("Creando gastos...");
  await prisma.gasto.create({ data: { fecha: daysFromNow(-1), categoria: "Alquiler", concepto: "Alquiler local", monto: 150000 } });
  await prisma.gasto.create({ data: { fecha: daysFromNow(-8), categoria: "Otros", concepto: "Internet y servicios", monto: 22000 } });

  console.log("Creando liquidaciones...");
  const mes = today.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const mesLabel = mes.charAt(0).toUpperCase() + mes.slice(1);
  await prisma.liquidacionProfesora.create({ data: { mes: mesLabel, profesoraId: cande.id, horas: 62, monto: 217000, estado: "Pagado" } });
  await prisma.liquidacionProfesora.create({ data: { mes: mesLabel, profesoraId: euge.id, horas: 54, monto: 189000, estado: "Pagado" } });
  await prisma.liquidacionProfesora.create({ data: { mes: mesLabel, profesoraId: fran.id, horas: 21, monto: 73500, estado: "Pendiente" } });

  console.log("Seed finalizado ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());