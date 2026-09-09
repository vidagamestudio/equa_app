import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AbonosPage() {
  const user = await getCurrentUser();
  const planes = [
    { nombre: "Clase suelta", precio: "desde $3.200", desc: "Sin vencimiento, se paga por clase" },
    { nombre: "Pack 4 clases", precio: "$14.800", desc: "Vence a los 30 días" },
    { nombre: "Pack 8 clases", precio: "$27.600", desc: "Vence a los 45 días" },
    { nombre: "Ilimitado mensual", precio: "$38.000", desc: "Sin límite de clases en el mes" },
  ];

  const abonos = await prisma.abono.findMany({
    where: { estudioId: user.estudioId },
    include: { alumna: true },
    orderBy: { fechaInicio: "desc" },
    take: 12,
  });

  return (
    <>
      <div className="page-head">
        <h1>Abonos</h1>
        <p className="muted">Planes vigentes del estudio, para vender de nuevo o renovar.</p>
      </div>

      <div className="grid grid-2 mb">
        {planes.map((p) => (
          <div className="card card-pad" key={p.nombre}>
            <div className="flex spread">
              <h3 style={{ fontSize: 16 }}>{p.nombre}</h3>
              <span className="badge accent">{p.precio}</span>
            </div>
            <p className="muted" style={{ marginTop: 8 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head"><h3>Abonos activos recientes</h3></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Alumna</th><th>Plan</th><th>Precio</th><th>Clases</th><th>Estado</th></tr></thead>
            <tbody>
              {abonos.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.alumna.nombre}</td>
                  <td>{a.tipo}</td>
                  <td className="amount">{money(a.precio)}</td>
                  <td className="muted">
                    {a.clasesTotales != null ? `${a.clasesUsadas}/${a.clasesTotales}` : "—"}
                  </td>
                  <td>
                    <span className={`badge ${a.estado === "Al día" ? "green" : a.estado === "Vencido" ? "red" : "amber"}`}>
                      {a.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}