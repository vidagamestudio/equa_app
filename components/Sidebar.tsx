"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { group: "Panel", items: [{ href: "/", label: "Panel" }] },
  {
    group: "Operación",
    items: [
      { href: "/agenda", label: "Agenda" },
      { href: "/alumnas", label: "Alumnas" },
      { href: "/profesoras", label: "Profesoras" },
    ],
  },
  {
    group: "Comercial",
    items: [
      { href: "/servicios", label: "Servicios y precios" },
      { href: "/abonos", label: "Abonos" },
      { href: "/ventas", label: "Ventas y facturación" },
      { href: "/compras", label: "Compras" },
      { href: "/reserva", label: "Reserva online" },
    ],
  },
  {
    group: "Finanzas",
    items: [
      { href: "/caja", label: "Caja" },
      { href: "/finanzas", label: "Estado de resultados" },
      { href: "/impuestos", label: "IVA / Impuestos" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="mark">A</div>
        <div>
          <div className="name">Estudio Aire</div>
          <div className="sub">Pilates · Gestión</div>
        </div>
      </div>

      <nav>
        {NAV.map((section) => (
          <div className="nav-group" key={section.group}>
            <div className="nav-group-title">{section.group}</div>
            {section.items.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${active ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}