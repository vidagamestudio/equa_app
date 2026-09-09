import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { money, longDate, shortDate } from "@/lib/format";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const today = startOfDay();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [clasesHoy, ventasHoy, activas, abonos, alumnaCount] = await Promise.all([
    prisma.clase.findMany({
      where: { estudioId: user.estudioId, fecha: { gte: today, lt: tomorrow } },
      orderBy: { horaInicio: "asc" },
      include: { servicio: true, profesora: true, reservas: true },
    }),
    prisma.venta.findMany({ where: { estudioId: user.estudioId, fecha: { gte: today, lt: tomorrow } } }),
    prisma.abono.findMany({
      where: { estudioId: user.estudioId, estado: { in: ["Al día", "Vence pronto"] } },
      include: { alumna: true },
    }),
    prisma.abono.findMany({
      where: { estudioId: user.estudioId, estado: { in: ["Vencido", "Vence pronto"] } },
      include: { alumna: true },
      orderBy: { fechaFin: "asc" },
    }),
    prisma.alumna.count({ where: { estudioId: user.estudioId, activa: true } }),
  ]);

  const cupos = clasesHoy.reduce((s, c) => s + c.servicio.cupo, 0);
  const reservadas = clasesHoy.reduce((s, c) => s + c.reservas.filter((r) => r.estado === "Confirmada").length, 0);
  const ocupacion = cupos ? Math.round((reservadas / cupos) * 100) : 0;
  const ingresosHoy = ventasHoy.reduce((s, v) => s + v.monto, 0);
  const activasCount = alumnaCount;

  return (
    <>
      <div className="page-head">
        <h1>Panel</h1>
        <p className="muted">{longDate(today)}</p>
      </div>

      <div className="grid grid-4 mb">
        <div className="card stat">
          <div className="label">Clases hoy</div>
          <div className="value">{clasesHoy.length}</div>
          <div className="hint">{reservadas} reservas</div>
        </div>
        <div className="card stat">
          <div className="label">Ocupación</div>
          <div className="value">{ocupacion}%</div>
          <div className="progress mt"><span style={{ width: `${ocupacion}%` }} /></div>
        </div>
        <div className="card stat">
          <div className="label">Ingresos del día</div>
          <div className="value">{money(ingresosHoy)}</div>
          <div className="hint">{ventasHoy.length} ventas</div>
        </div>
        <div className="card stat">
          <div className="label">Alumnas activas</div>
          <div className="value">{activasCount}</div>
          <div className="hint">{activas.length} con abono vigente</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Próximas clases</h3>
            <Link href="/agenda" className="link-btn">Ver agenda completa →</Link>
          </div>
          <div className="list">
            {clasesHoy.length === 0 && <div className="list-row muted">No hay clases programadas hoy.</div>}
            {clasesHoy.map((c) => {
              const confirmadas = c.reservas.filter((r) => r.estado === "Confirmada").length;
              const full = confirmadas >= c.servicio.cupo;
              return (
                <div className="list-row" key={c.id}>
                  <div className="main">
                    <div className="l-title">{c.horaInicio} · {c.servicio.nombre}</div>
                    <div className="l-sub">{c.profesora.nombre}</div>
                  </div>
                  <span className={`badge ${full ? "amber" : "accent"}`}>{confirmadas}/{c.servicio.cupo}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Vencimientos próximos</h3>
            <Link href="/alumnas" className="link-btn">Ver todas las alumnas →</Link>
          </div>
          <div className="list">
            {abonos.length === 0 && <div className="list-row muted">Sin vencimientos pendientes.</div>}
            {abonos.map((a) => (
              <div className="list-row" key={a.id}>
                <div className="main">
                  <div className="l-title">{a.alumna.nombre}</div>
                  <div className="l-sub">
                    {a.tipo === "Clase suelta"
                      ? "Clase suelta"
                      : a.tipo.includes("Pack")
                        ? `quedan ${(a.clasesTotales ?? 0) - a.clasesUsadas} clases del pack`
                        : "Ilimitado"}
                    {a.fechaFin && ` · vence ${shortDate(a.fechaFin)}`}
                  </div>
                </div>
                <span className={`badge ${a.estado === "Vencido" ? "red" : "amber"}`}>{a.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}