"use client";

import { useActionState } from "react";
import { marcarPagoProfesoraAction } from "@/app/actions";

export function PagarProfesoraButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(marcarPagoProfesoraAction, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="btn" disabled={pending} type="submit">
        {pending ? "Marcando…" : "Marcar como pagado"}
      </button>
    </form>
  );
}