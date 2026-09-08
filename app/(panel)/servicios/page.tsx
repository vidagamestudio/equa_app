import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  const servicios = await prisma.servicio.findMany({ where: { activo: true } });

  return (
    <>
      <div className="page-head">
        <h1>Servicios y precios</h1>
        <p className="muted">Cupo, duración y precio de clase suelta de cada formato.</p>
      </div>

      <div className="grid grid-2">
        {servicios.map((s) => (
          <div className="card card-pad" key={s.id}>
            <div className="flex spread">
              <h3 style={{ fontSize: 17 }}>{s.nombre}</h3>
              <div className="big-number" style={{ fontSize: 26, color: "var(--accent-strong)" }}>{money(s.precio)}</div>
            </div>
            <p className="muted" style={{ marginTop: 8 }}>Cupo {s.cupo} · {s.duracion} min</p>
            <div className="progress mt"><span style={{ width: "40%" }} /></div>
          </div>
        ))}
      </div>
    </>
  );
}