import QRCode from "qrcode";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { shortDate } from "@/lib/format";
import { CopyLinkButton } from "@/components/CopyLinkButton";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function ReservaPage() {
  const today = startOfDay();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [proximas, h] = await Promise.all([
    prisma.clase.findMany({
      where: { fecha: { gte: today, lt: tomorrow } },
      orderBy: { horaInicio: "asc" },
      include: { servicio: true, profesora: true, reservas: true },
      take: 6,
    }),
    headers(),
  ]);

  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const reservarUrl = `${proto}://${host}/reservar`;

  const qrDataUrl = await QRCode.toDataURL(reservarUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#1a1d21", light: "#ffffff" },
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
          <code className="mono" style={{ background: "var(--surface-2)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", wordBreak: "break-all" }}>
            {reservarUrl}
          </code>
          <CopyLinkButton url={reservarUrl} />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <h3 className="mb">QR real</h3>
          <p className="muted" style={{ marginTop: 0 }}>Para pegar en el mostrador o las redes del estudio.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR de reserva online" width={220} height={220} style={{ borderRadius: 8, border: "1px solid var(--border)" }} />
        </div>

        <div className="card">
          <div className="card-head"><h3>Así lo ve la alumna</h3></div>
          <div className="list">
            {proximas.length === 0 && <div className="list-row muted">No hay clases disponibles hoy.</div>}
            {proximas.map((c) => {
              const lugares = c.servicio.cupo - c.reservas.filter((r) => r.estado === "Confirmada").length;
              return (
                <div className="list-row" key={c.id}>
                  <div className="main">
                    <div className="l-title">{c.horaInicio} · {c.servicio.nombre}</div>
                    <div className="l-sub">{c.profesora.nombre} · {shortDate(c.fecha)}</div>
                  </div>
                  <span className={`badge ${lugares <= 0 ? "red" : lugares <= 1 ? "amber" : "green"}`}>
                    {lugares > 0 ? `${lugares} ${lugares === 1 ? "lugar" : "lugares"}` : "Completo"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}