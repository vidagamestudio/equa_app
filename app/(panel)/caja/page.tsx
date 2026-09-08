import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { RegistrarGastoForm } from "@/components/RegistrarGastoForm";

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
}

export const dynamic = "force-dynamic";

export default async function CajaPage() {
  const { start, end } = monthBounds();
  const mes = start.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const [ventas, gastos, compras, liquidaciones] = await Promise.all([
    prisma.venta.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.gasto.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.compra.findMany({ where: { fecha: { gte: start, lt: end } } }),
    prisma.liquidacionProfesora.findMany(),
  ]);

  const totalVentas = ventas.reduce((s, v) => s + v.monto, 0);
  const clasesSuelas = ventas.filter((v) => v.concepto.toLowerCase().includes("clase suelta")).reduce((s, v) => s + v.monto, 0);
  const abonos = totalVentas - clasesSuelas;

  const liquidacion = liquidaciones.reduce((s, l) => s + l.monto, 0);
  const alquiler = gastos.filter((g) => g.categoria === "Alquiler").reduce((s, g) => s + g.monto, 0);
  const insumos = compras.reduce((s, c) => s + c.monto, 0) + gastos.filter((g) => g.categoria === "Insumos").reduce((s, g) => s + g.monto, 0);
  const otros = gastos.filter((g) => g.categoria === "Otros").reduce((s, g) => s + g.monto, 0);

  const totalGastos = liquidacion + alquiler + insumos + otros;
  const resultado = totalVentas - totalGastos;

  const medios = ["Transferencia", "Efectivo", "Tarjeta"].map((m) => ({
    medio: m,
    total: ventas.filter((v) => v.medioPago === m).reduce((s, v) => s + v.monto, 0),
  }));

  return (
    <>
      <div className="page-head spread flex">
        <div>
          <h1>Caja</h1>
          <p className="muted">{mes.charAt(0).toUpperCase() + mes.slice(1)}</p>
        </div>
        <RegistrarGastoForm />
      </div>

      <div className="card stat mb" style={{ background: "var(--accent-strong)", color: "#fff", border: "none" }}>
        <div className="label" style={{ color: "rgba(255,255,255,.75)" }}>Resultado del mes</div>
        <div className="value">{money(resultado)}</div>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <div className="card-head"><h3>Ingresos</h3></div>
          <div className="list">
            <div className="list-row">
              <div className="main l-title">Clases sueltas</div>
              <div className="amount">{money(clasesSuelas)}</div>
            </div>
            <div className="list-row">
              <div className="main l-title">Abonos</div>
              <div className="amount">{money(abonos)}</div>
            </div>
            <div className="list-row">
              <div className="main" style={{ fontWeight: 700 }}>Total</div>
              <div className="amount positive">{money(totalVentas)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Gastos</h3></div>
          <div className="list">
            {[
              { label: "Profesoras (liquidación)", val: liquidacion },
              { label: "Alquiler", val: alquiler },
              { label: "Insumos", val: insumos },
              { label: "Otros", val: otros },
            ].map((g) => (
              <div className="list-row" key={g.label}>
                <div className="main l-title">{g.label}</div>
                <div className="amount negative">{money(g.val)}</div>
              </div>
            ))}
            <div className="list-row">
              <div className="main" style={{ fontWeight: 700 }}>Total</div>
              <div className="amount">{money(totalGastos)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Medios de pago del mes</h3></div>
        <div className="list">
          {medios.map((m) => (
            <div className="list-row" key={m.medio}>
              <div className="main l-title">{m.medio}</div>
              <div className="amount">{money(m.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}