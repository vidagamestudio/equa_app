import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="title">Estudio Aire Pilates</span>
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