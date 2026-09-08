import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ImpuestosPage() {
  const desde = new Date();
  desde.setMonth(desde.getMonth() - 12);

  const ventas = await prisma.venta.findMany({ where: { fecha: { gte: desde } } });
  const facturado12 = ventas.reduce((s, v) => s + v.monto, 0);

  const tope = 9200000;
  const pct = Math.min(100, Math.round((facturado12 / tope) * 100));
  const cerca = pct >= 80;

  return (
    <>
      <div className="page-head">
        <h1>IVA / Impuestos</h1>
        <p className="muted">Estado del monotributo del estudio.</p>
      </div>

      <div className="grid grid-3 mb">
        <div className="card stat">
          <div className="label">Categoría actual</div>
          <div className="value">D</div>
        </div>
        <div className="card stat">
          <div className="label">Facturado (últimos 12 meses)</div>
          <div className="value">{money(facturado12)}</div>
        </div>
        <div className="card stat">
          <div className="label">Tope de la categoría</div>
          <div className="value">{money(tope)}</div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex spread">
          <div>
            <h3 className="mb">{pct}% del tope</h3>
            <span className={`badge ${cerca ? "amber" : "green"}`}>{cerca ? "Cerca del límite" : "Con margen"}</span>
          </div>
        </div>
        <div className="progress mt"><span style={{ width: `${pct}%`, background: cerca ? "var(--amber)" : "var(--green)" }} /></div>
      </div>

      <div className="divider" />
      <p className="muted" style={{ fontSize: 12 }}>
        Valores de ejemplo — se conecta con la facturación real del estudio, no son datos de AFIP.
      </p>
    </>
  );
}