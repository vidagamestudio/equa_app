import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { money, shortDate } from "@/lib/format";
import { RegistrarVentaForm } from "@/components/RegistrarVentaForm";

export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const user = await getCurrentUser();
  const ventas = await prisma.venta.findMany({
    where: { estudioId: user.estudioId },
    include: { alumna: true },
    orderBy: { fecha: "desc" },
    take: 20,
  });
  const total = ventas.reduce((s, v) => s + v.monto, 0);
  const alumnas = await prisma.alumna.findMany({ where: { estudioId: user.estudioId, activa: true }, select: { id: true, nombre: true }, orderBy: { nombre: "asc" } });

  return (
    <>
      <div className="page-head spread flex">
        <div>
          <h1>Ventas y facturación</h1>
          <p className="muted">Cada abono o clase suelta vendida, con su comprobante.</p>
        </div>
        <RegistrarVentaForm alumnas={alumnas} />
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Últimas ventas</h3>
          <span className="badge accent">{money(total)}</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Alumna</th><th>Fecha</th><th>Concepto</th><th>Comprobante</th><th>Medio</th><th className="amount">Monto</th></tr></thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.alumna.nombre}</td>
                  <td className="muted">{shortDate(v.fecha)}</td>
                  <td>{v.concepto}</td>
                  <td><span className="badge neutral">{v.tipoComprobante}</span></td>
                  <td className="muted">{v.medioPago}</td>
                  <td className="amount">{money(v.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}