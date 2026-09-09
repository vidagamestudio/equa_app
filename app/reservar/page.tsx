import { prisma } from "@/lib/db";
import { ReservaForm } from "@/components/ReservaForm";

export const metadata = { title: "Reservar · Estudio Aire" };

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function ReservarPublicPage() {
  const today = startOfDay();
  const end = new Date(today.getTime() + 6 * 86400000);

  const clases = await prisma.clase.findMany({
    where: { fecha: { gte: today, lt: end } },
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
    include: { servicio: true, profesora: true, reservas: true },
  });

  const disponibles = clases
    .map((c) => ({
      id: c.id,
      horaInicio: c.horaInicio,
      servicio: c.servicio,
      profesora: c.profesora,
      cupo: c.servicio.cupo,
      ocupadas: c.reservas.filter((r) => r.estado === "Confirmada").length,
      fecha: c.fecha.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }),
    }))
    .filter((c) => c.ocupadas < c.cupo);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg,#6d5bd0,#b18cff)", color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>Estudio Aire</div>
          <div className="muted" style={{ fontSize: 12 }}>Pilates</div>
        </div>
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Reservá tu clase</h1>
      <p className="muted" style={{ margin: "0 0 24px" }}>
        Elegí el horario que te quede mejor y confirmá tu lugar.
      </p>

      {disponibles.length === 0 ? (
        <div className="card card-pad">
          <p style={{ margin: 0 }}>No hay clases disponibles con lugar en los próximos días. Volvé más tarde.</p>
        </div>
      ) : (
        <div className="card card-pad">
          <ReservaForm clases={disponibles} />
        </div>
      )}

      <p className="muted" style={{ fontSize: 12, marginTop: 20, textAlign: "center" }}>
        Estudio Aire Pilates · Buenos Aires
      </p>
    </div>
  );
}