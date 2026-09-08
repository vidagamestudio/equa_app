import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { PagarProfesoraButton } from "@/components/PagarProfesoraButton";

export const dynamic = "force-dynamic";

export default async function ProfesorasPage() {
  const liquidaciones = await prisma.liquidacionProfesora.findMany({
    include: { profesora: true },
    orderBy: { mes: "asc" },
  });
  const mes = liquidaciones[0]?.mes ?? "";
  const total = liquidaciones.reduce((s, l) => s + l.monto, 0);
  const pagado = liquidaciones.filter((l) => l.estado === "Pagado").reduce((s, l) => s + l.monto, 0);

  return (
    <>
      <div className="page-head">
        <h1>Profesoras</h1>
        <p className="muted">Liquidación de {mes} · horas dictadas y pago mensual por profesora.</p>
      </div>

      <div className="grid grid-4 mb">
        <div className="card stat">
          <div className="label">Total a pagar este mes</div>
          <div className="value">{money(total)}</div>
        </div>
        <div className="card stat">
          <div className="label">Pagado</div>
          <div className="value positive">{money(pagado)}</div>
        </div>
        <div className="card stat">
          <div className="label">Pendiente</div>
          <div className="value negative">{money(total - pagado)}</div>
        </div>
        <div className="card stat">
          <div className="label">Profesoras activas</div>
          <div className="value">{liquidaciones.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Liquidaciones de {mes}</h3></div>
        <div className="list">
          {liquidaciones.map((l) => (
            <div className="list-row" key={l.id}>
              <div className="avatar">{l.profesora.nombre[0]}</div>
              <div className="main">
                <div className="l-title">{l.profesora.nombre}</div>
                <div className="l-sub">{l.horas} h dictadas · {money(l.profesora.tarifaHora)}/h</div>
              </div>
              <div className="l-right">
                <div style={{ fontWeight: 700 }}>{money(l.monto)}</div>
                <div className="mt" style={{ marginTop: 6 }}>
                  {l.estado === "Pagado" ? (
                    <span className="badge green">Pagado</span>
                  ) : (
                    <PagarProfesoraButton id={l.id} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}