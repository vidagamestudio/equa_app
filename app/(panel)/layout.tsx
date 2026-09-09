import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const estudio = await prisma.estudio.findUnique({ where: { id: user.estudioId } });

  const brand = {
    nombre: estudio?.nombre ?? "Estudio",
    subtitulo: estudio?.subtitulo ?? "Gestión",
    corto: estudio?.corto ?? "",
    marca: estudio?.marca ?? "A",
  };

  return (
    <div className="app">
      <Sidebar estudio={brand} />
      <div className="main">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="title">{brand.nombre} {brand.corto}</span>
          </div>
          <div className="flex">
            <div className="user-chip">
              <div>
                <div className="u-name">{user.name}</div>
                <div className="u-mail">{user.email}</div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}