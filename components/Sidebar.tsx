"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type EstudioBrand = {
  nombre: string;
  subtitulo: string;
  corto: string;
  marca: string;
};

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

export function Sidebar({ estudio }: { estudio: EstudioBrand }) {
  const pathname = usePathname();
  const mark = estudio.marca.slice(0, 1).toUpperCase();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="mark">{mark}</div>
        <div>
          <div className="name">{estudio.nombre}</div>
          <div className="sub">{estudio.subtitulo}</div>
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