import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
}

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const { start, end } = monthBounds();
  const mes = start.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const [ventas, gastos, compras, liquidaciones] = await Promise.all([
    prisma.venta.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.gasto.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.compra.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.liquidacionProfesora.findMany(),
  ]);

  const facturado = ventas.reduce((s, v) => s + v.monto, 0);
  const liquidacion = liquidaciones.reduce((s, l) => s + l.monto, 0);
  const insumos = compras.reduce((s, c) => s + c.monto, 0);
  const margen = facturado - liquidacion - insumos;
  const alquiler = gastos.filter((g) => g.categoria === "Alquiler").reduce((s, g) => s + g.monto, 0);
  const otros = gastos.filter((g) => g.categoria === "Otros").reduce((s, g) => s + g.monto, 0);
  const neto = margen - alquiler - otros;

  return (
    <>
      <div className="page-head">
        <h1>Estado de resultados</h1>
        <p className="muted">{mes.charAt(0).toUpperCase() + mes.slice(1)} — de la facturación a lo que queda.</p>
      </div>

      <div className="card stat mb" style={{ background: "var(--accent-strong)", color: "#fff", border: "none" }}>
        <div className="label" style={{ color: "rgba(255,255,255,.75)" }}>Resultado neto</div>
        <div className="value">{money(neto)}</div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <div className="card-head"><h3>Ingresos</h3></div>
          <div className="list">
            <div className="list-row">
              <div className="main l-title">Facturado</div>
              <div className="amount positive">{money(facturado)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Costos directos</h3></div>
          <div className="list">
            <div className="list-row">
              <div className="main l-title">Liquidación profesoras</div>
              <div className="amount negative">{money(liquidacion)}</div>
            </div>
            <div className="list-row">
              <div className="main l-title">Insumos</div>
              <div className="amount negative">{money(insumos)}</div>
            </div>
            <div className="list-row">
              <div className="main" style={{ fontWeight: 700 }}>Margen operativo</div>
              <div className="amount">{money(margen)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Gastos fijos</h3></div>
          <div className="list">
            <div className="list-row">
              <div className="main l-title">Alquiler</div>
              <div className="amount negative">{money(alquiler)}</div>
            </div>
            <div className="list-row">
              <div className="main l-title">Otros</div>
              <div className="amount negative">{money(otros)}</div>
            </div>
            <div className="list-row">
              <div className="main" style={{ fontWeight: 700 }}>Resultado neto</div>
              <div className="amount">{money(neto)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}