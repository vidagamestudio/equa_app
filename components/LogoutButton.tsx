"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn ghost"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
    >
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}