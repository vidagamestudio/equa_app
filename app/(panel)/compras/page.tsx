import { prisma } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ComprasPage() {
  const compras = await prisma.compra.findMany({ orderBy: { fecha: "desc" } });
  const total = compras.reduce((s, c) => s + c.monto, 0);

  return (
    <>
      <div className="page-head">
        <h1>Compras</h1>
        <p className="muted">Insumos y repuestos del estudio.</p>
      </div>

      <div className="grid grid-4 mb">
        <div className="card stat">
          <div className="label">Compras del mes</div>
          <div className="value">{money(total)}</div>
          <div className="hint">{compras.length} operaciones</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Fecha</th><th>Proveedor</th><th>Concepto</th><th className="amount">Monto</th></tr></thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td className="muted">{shortDate(c.fecha)}</td>
                  <td style={{ fontWeight: 600 }}>{c.proveedor}</td>
                  <td>{c.concepto}</td>
                  <td className="amount">{money(c.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}