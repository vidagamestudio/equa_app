import { prisma } from "@/lib/db";
import { money, shortDate } from "@/lib/format";
import { AltaAlumnaForm } from "@/components/AltaAlumnaForm";

function initials(nombre: string) {
  return nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export const dynamic = "force-dynamic";

export default async function AlumnasPage() {
  const alumnas = await prisma.alumna.findMany({
    where: { activa: true },
    include: {
      abonos: { orderBy: { fechaInicio: "desc" } },
      ventas: { orderBy: { fecha: "desc" } },
    },
    orderBy: { nombre: "asc" },
  });

  return (
    <>
      <div className="page-head spread flex">
        <div>
          <h1>Alumnas</h1>
          <p className="muted">{alumnas.length} activas · plan, vencimiento y estado de cada una.</p>
        </div>
        <AltaAlumnaForm />
      </div>

      <div className="card">
        <div className="list">
          {alumnas.map((al) => {
            const abono = al.abonos[0];
            const ultimaVenta = al.ventas[0];
            return (
              <div className="list-row" key={al.id}>
                <div className="avatar">{initials(al.nombre)}</div>
                <div className="main">
                  <div className="l-title">{al.nombre}</div>
                  <div className="l-sub">
                    {abono
                      ? `${abono.tipo}${abono.tipo.includes("Pack") ? ` · quedan ${(abono.clasesTotales ?? 0) - abono.clasesUsadas} clases` : ""}${abono.fechaFin ? ` · vence ${shortDate(abono.fechaFin)}` : ""}`
                      : "Sin abono activo"}
                    {ultimaVenta && ` · última ${money(ultimaVenta.monto)} ${shortDate(ultimaVenta.fecha)}`}
                  </div>
                </div>
                <span className={`badge ${abono?.estado === "Al día" ? "green" : abono?.estado === "Vencido" ? "red" : "amber"}`}>
                  {abono?.estado ?? "Pendiente"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}