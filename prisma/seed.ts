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
  return new Date(today.getTime() + n * DAY);
}
function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

type EstudioDef = {
  id: string;
  nombre: string;
  subtitulo: string;
  corto: string;
  ciudad: string;
  marca: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  slug: string;
  adminEmail: string;
  adminPassword: string;
};

async function seedEstudio(e: EstudioDef) {
  const passwordHash = await bcrypt.hash(e.adminPassword, 10);

  await prisma.estudio.create({
    data: {
      id: e.id,
      nombre: e.nombre,
      subtitulo: e.subtitulo,
      corto: e.corto,
      ciudad: e.ciudad,
      marca: e.marca,
      accent: e.accent,
      accentStrong: e.accentStrong,
      accentSoft: e.accentSoft,
      slug: e.slug,
      users: {
        create: { email: e.adminEmail, passwordHash, name: "Admin" },
      },
    },
  });

  const reformer = await prisma.servicio.create({ data: { estudioId: e.id, nombre: "Reformer", precio: 4200, cupo: 6, duracion: 50 } });
  const mat = await prisma.servicio.create({ data: { estudioId: e.id, nombre: "Mat", precio: 3200, cupo: 8, duracion: 50 } });
  const duo = await prisma.servicio.create({ data: { estudioId: e.id, nombre: "Duo Reformer", precio: 5800, cupo: 2, duracion: 50 } });
  const matEmb = await prisma.servicio.create({ data: { estudioId: e.id, nombre: "Mat embarazadas", precio: 3400, cupo: 6, duracion: 45 } });

  const cande = await prisma.profesora.create({ data: { estudioId: e.id, nombre: "Cande", tarifaHora: 3500 } });
  const euge = await prisma.profesora.create({ data: { estudioId: e.id, nombre: "Euge", tarifaHora: 3500 } });
  const fran = await prisma.profesora.create({ data: { estudioId: e.id, nombre: "Fran", tarifaHora: 3500 } });

  const nombres = [
    "Rocío Fernández", "Marina Sosa", "Julieta Paz", "Ana Giménez", "Sole Duarte",
    "Vale Molina", "Laura Paredes", "María Ibáñez", "Cecilia Roldán", "Paula Vega",
  ];
  const alumnas = [];
  for (const n of nombres) {
    alumnas.push(await prisma.alumna.create({ data: { estudioId: e.id, nombre: n } }));
  }

  const [rocio, marina, julieta, ana, sole, vale, laura, maria, cecilia, paula] = alumnas;
  const abonos: { alumnaId: string; tipo: string; precio: number; fechaInicio: Date; fechaFin?: Date; clasesTotales?: number; clasesUsadas: number; estado: string }[] = [
    { alumnaId: rocio.id, tipo: "Ilimitado mensual", precio: 38000, fechaInicio: daysFromNow(-20), fechaFin: daysFromNow(10), clasesUsadas: 0, estado: "Al día" },
    { alumnaId: marina.id, tipo: "Pack 8", precio: 27600, fechaInicio: daysFromNow(-40), fechaFin: daysFromNow(5), clasesTotales: 8, clasesUsadas: 6, estado: "Vence pronto" },
    { alumnaId: julieta.id, tipo: "Pack 4", precio: 14800, fechaInicio: daysFromNow(-35), fechaFin: daysFromNow(-3), clasesTotales: 4, clasesUsadas: 1, estado: "Vencido" },
    { alumnaId: ana.id, tipo: "Ilimitado mensual", precio: 38000, fechaInicio: daysFromNow(-15), fechaFin: daysFromNow(15), clasesUsadas: 0, estado: "Al día" },
    { alumnaId: vale.id, tipo: "Pack 8", precio: 27600, fechaInicio: daysFromNow(-25), fechaFin: daysFromNow(20), clasesTotales: 8, clasesUsadas: 3, estado: "Al día" },
    { alumnaId: laura.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-2), clasesUsadas: 0, estado: "Al día" },
    { alumnaId: maria.id, tipo: "Pack 8", precio: 27600, fechaInicio: daysFromNow(-10), fechaFin: daysFromNow(35), clasesTotales: 8, clasesUsadas: 1, estado: "Al día" },
    { alumnaId: cecilia.id, tipo: "Pack 4", precio: 14800, fechaInicio: daysFromNow(-5), fechaFin: daysFromNow(25), clasesTotales: 4, clasesUsadas: 0, estado: "Al día" },
    { alumnaId: paula.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-1), clasesUsadas: 0, estado: "Al día" },
    { alumnaId: sole.id, tipo: "Clase suelta", precio: 3200, fechaInicio: daysFromNow(-3), clasesUsadas: 0, estado: "Al día" },
  ];
  for (const a of abonos) {
    await prisma.abono.create({ data: { ...a, estudioId: e.id } });
  }

  const defs = [
    { servicio: mat, hora: "17:00", profesora: euge },
    { servicio: reformer, hora: "18:30", profesora: fran },
    { servicio: mat, hora: "20:00", profesora: euge },
    { servicio: reformer, hora: "09:00", profesora: cande },
    { servicio: duo, hora: "10:30", profesora: cande },
    { servicio: matEmb, hora: "16:00", profesora: euge },
  ];
  const clases = [];
  for (let i = 0; i < 8; i++) {
    const d = daysFromNow(i);
    if (isWeekend(d)) continue;
    for (const df of defs) {
      const c = await prisma.clase.create({
        data: { estudioId: e.id, fecha: d, horaInicio: df.hora, servicioId: df.servicio.id, profesoraId: df.profesora.id },
      });
      clases.push({ id: c.id, cupo: df.servicio.cupo });
    }
  }
  for (const [idx, c] of clases.entries()) {
    const num = Math.max(0, Math.min(c.cupo, 2 + (idx % 7)));
    for (let r = 0; r < num; r++) {
      const al = alumnas[(idx + r) % alumnas.length];
      await prisma.reserva.create({ data: { estudioId: e.id, claseId: c.id, alumnaId: al.id, estado: "Confirmada" } });
    }
  }

  const ventas: { alumnaId: string; concepto: string; tipoComprobante: string; monto: number; medioPago: string; fecha: Date }[] = [
    { alumnaId: ana.id, concepto: "Ilimitado mensual", tipoComprobante: "Factura C", monto: 38000, medioPago: "Transferencia", fecha: daysFromNow(-2) },
    { alumnaId: vale.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Tarjeta", fecha: daysFromNow(-3) },
    { alumnaId: sole.id, concepto: "Clase suelta Mat", tipoComprobante: "Recibo", monto: 3200, medioPago: "Efectivo", fecha: daysFromNow(-4) },
    { alumnaId: marina.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Transferencia", fecha: daysFromNow(-6) },
    { alumnaId: julieta.id, concepto: "Pack 4 clases", tipoComprobante: "Factura C", monto: 14800, medioPago: "Efectivo", fecha: daysFromNow(-8) },
    { alumnaId: laura.id, concepto: "Clase suelta Reformer", tipoComprobante: "Recibo", monto: 4200, medioPago: "Efectivo", fecha: daysFromNow(-10) },
    { alumnaId: maria.id, concepto: "Pack 8 clases", tipoComprobante: "Factura C", monto: 27600, medioPago: "Transferencia", fecha: daysFromNow(-12) },
    { alumnaId: cecilia.id, concepto: "Pack 4 clases", tipoComprobante: "Factura C", monto: 14800, medioPago: "Transferencia", fecha: daysFromNow(-15) },
    { alumnaId: rocio.id, concepto: "Ilimitado mensual", tipoComprobante: "Factura C", monto: 38000, medioPago: "Tarjeta", fecha: daysFromNow(-18) },
    { alumnaId: vale.id, concepto: "Clase suelta Duo Reformer", tipoComprobante: "Recibo", monto: 5800, medioPago: "Efectivo", fecha: daysFromNow(-20) },
  ];
  for (const v of ventas) {
    await prisma.venta.create({ data: { ...v, estudioId: e.id } });
  }

  const compras = [
    { proveedor: "Fit Insumos SRL", concepto: "Bandas elásticas y pelotas", monto: 16400, fecha: daysFromNow(-5) },
    { proveedor: "Aguas del Sur", concepto: "Bidones de agua x10", monto: 9800, fecha: daysFromNow(-10) },
    { proveedor: "Distribuidora Pilates BA", concepto: "Aceite para rieles del reformer", monto: 6200, fecha: daysFromNow(-15) },
    { proveedor: "Textil Hogar", concepto: "Toallas para clase x20", monto: 5600, fecha: daysFromNow(-20) },
  ];
  for (const c of compras) {
    await prisma.compra.create({ data: { ...c, estudioId: e.id } });
  }

  const gastos = [
    { categoria: "Alquiler", concepto: "Alquiler local", monto: 150000, fecha: daysFromNow(-1) },
    { categoria: "Otros", concepto: "Internet y servicios", monto: 22000, fecha: daysFromNow(-8) },
  ];
  for (const g of gastos) {
    await prisma.gasto.create({ data: { ...g, estudioId: e.id } });
  }

  const mes = today.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const mesLabel = mes.charAt(0).toUpperCase() + mes.slice(1);
  const liqs = [
    { profesoraId: cande.id, horas: 62, monto: 217000, estado: "Pagado" },
    { profesoraId: euge.id, horas: 54, monto: 189000, estado: "Pagado" },
    { profesoraId: fran.id, horas: 21, monto: 73500, estado: "Pendiente" },
  ];
  for (const l of liqs) {
    await prisma.liquidacionProfesora.create({ data: { ...l, estudioId: e.id, mes: mesLabel } });
  }
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
  await prisma.estudio.deleteMany();

  const estudios: EstudioDef[] = [
    {
      id: "estudio_aire", nombre: "Estudio Aire", subtitulo: "Pilates · Gestión", corto: "Pilates",
      ciudad: "Buenos Aires", marca: "A", accent: "#6d5bd0", accentStrong: "#5a49b8", accentSoft: "#efeefb",
      slug: "estudio-aire", adminEmail: "admin@estudioaire.com", adminPassword: "admin123",
    },
    {
      id: "estudio_sol", nombre: "Pilates Sol", subtitulo: "Reformer & Mat", corto: "Pilates",
      ciudad: "San Isidro", marca: "S", accent: "#0f766e", accentStrong: "#115e59", accentSoft: "#f0fdfa",
      slug: "pilates-sol", adminEmail: "admin@pilatessol.com", adminPassword: "admin123",
    },
  ];

  for (const e of estudios) {
    console.log(`Sembrando ${e.nombre}...`);
    await seedEstudio(e);
  }

  console.log("Seed finalizado ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());