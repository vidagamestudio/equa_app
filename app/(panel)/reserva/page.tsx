import { prisma } from "@/lib/db";
import { shortDate } from "@/lib/format";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function ReservaPage() {
  const today = startOfDay();
  const tomorrow = new Date(today.getTime() + 86400000);

  const proximas = await prisma.clase.findMany({
    where: { fecha: { gte: today, lt: tomorrow } },
    orderBy: { horaInicio: "asc" },
    include: { servicio: true, profesora: true, reservas: true },
    take: 6,
  });

  return (
    <>
      <div className="page-head">
        <h1>Reserva online</h1>
        <p className="muted">Turnos sin llamar — las alumnas reservan su clase solas, desde el celular.</p>
      </div>

      <div className="card card-pad mb">
        <span className="badge green mb" style={{ marginBottom: 12 }}>Reserva activa</span>
        <p className="muted" style={{ margin: "0 0 6px" }}>Visible para cualquiera con el link</p>
        <div className="flex">
          <code className="mono" style={{ background: "var(--surface-2)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
            estudioaire.yex.app/reservar
          </code>
          <button className="btn">Copiar</button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <h3 className="mb">QR de ejemplo</h3>
          <p className="muted" style={{ marginTop: 0 }}>Para pegar en el mostrador o las redes del estudio.</p>
          <div className="qr"><div className="qr-inner">A</div></div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Así lo ve la alumna</h3></div>
          <div className="list">
            {proximas.map((c) => {
              const lugares = c.servicio.cupo - c.reservas.filter((r) => r.estado === "Confirmada").length;
              return (
                <div className="list-row" key={c.id}>
                  <div className="main">
                    <div className="l-title">{c.horaInicio} · {c.servicio.nombre}</div>
                    <div className="l-sub">{c.profesora.nombre} · {shortDate(c.fecha)}</div>
                  </div>
                  <span className={`badge ${lugares <= 1 ? "amber" : "green"}`}>{lugares} {lugares === 1 ? "lugar" : "lugares"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}