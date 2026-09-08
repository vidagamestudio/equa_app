import Link from "next/link";
import { prisma } from "@/lib/db";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const today = startOfDay();
  const week = Array.from({ length: 7 }, (_, i) => new Date(today.getTime() + i * 86400000));
  const first = week[0];
  const last = new Date(week[6].getTime() + 86400000);

  const clases = await prisma.clase.findMany({
    where: { fecha: { gte: first, lt: last } },
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
    include: { servicio: true, profesora: true, reservas: { include: { alumna: true } } },
  });

  return (
    <>
      <div className="page-head">
        <h1>Agenda</h1>
        <p className="muted">
          Reserva online activada — las alumnas también pueden anotarse solas.
        </p>
      </div>

      <div className="grid mb" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
        {week.map((d, i) => {
          const dayClases = clases.filter((c) => c.fecha.getTime() === d.getTime());
          const isToday = d.getTime() === today.getTime();
          return (
            <div key={i} className="card card-pad" style={{ padding: "14px 12px", borderColor: isToday ? "var(--accent)" : undefined, background: isToday ? "var(--accent-soft)" : undefined }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                {DAY_NAMES[d.getDay()]}
              </div>
              <div style={{ fontSize: 22, fontWeight: 750 }}>{d.getDate()}</div>
              <div style={{ fontSize: 12, color: "var(--accent-strong)", fontWeight: 700 }}>{dayClases.length} clases</div>
            </div>
          );
        })}
      </div>

      {week.map((d) => {
        const dayClases = clases.filter((c) => c.fecha.getTime() === d.getTime());
        if (dayClases.length === 0) return null;
        return (
          <div className="card mb" key={d.toISOString()}>
            <div className="card-head">
              <h3>{DAY_NAMES[d.getDay()]} {d.getDate()} · {d.toLocaleDateString("es-AR", { month: "long" })}</h3>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr><th>Hora</th><th>Clase</th><th>Profesora</th><th>Ocupación</th><th>Alumnas</th></tr>
                </thead>
                <tbody>
                  {dayClases.map((c) => {
                    const confirmadas = c.reservas.filter((r) => r.estado === "Confirmada");
                    const full = confirmadas.length >= c.servicio.cupo;
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700 }}>{c.horaInicio}</td>
                        <td>{c.servicio.nombre}</td>
                        <td>{c.profesora.nombre}</td>
                        <td>
                          <div className="flex">
                            <span className={`badge ${full ? "amber" : "accent"}`}>{confirmadas.length}/{c.servicio.cupo}</span>
                            <div className="progress grow" style={{ maxWidth: 120 }}>
                              <span style={{ width: `${Math.round((confirmadas.length / c.servicio.cupo) * 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="muted" style={{ maxWidth: 260 }}>
                          {confirmadas.map((r, i) => (
                            <span key={r.id}>{r.alumna.nombre.split(" ")[0]}{i < confirmadas.length - 1 ? ", " : ""}</span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <Link href="/agenda" className="link-btn">Reservar online →</Link>
    </>
  );
}