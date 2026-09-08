"use client";

import { useActionState, useState } from "react";
import { altaAlumnaAction } from "@/app/actions";

const initialState = null as { error: string } | null;

export function AltaAlumnaForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(altaAlumnaAction, initialState);

  if (!open) {
    return (
      <button className="btn primary" onClick={() => setOpen(true)}>+ Nueva alumna</button>
    );
  }

  return (
    <div className="card card-pad" style={{ width: 340 }}>
      <form action={formAction}>
        {state?.error && <div className="form-error">{state.error}</div>}
        {state === null && !pending && (
          <div className="alert mb">Alumna creada ✔</div>
        )}
        <div className="field">
          <label>Nombre completo</label>
          <input className="input" name="nombre" required />
        </div>
        <div className="field">
          <label>Email</label>
          <input className="input" name="email" type="email" />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input className="input" name="telefono" />
        </div>
        <div className="flex">
          <button className="btn primary" disabled={pending}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
          <button type="button" className="btn" onClick={() => setOpen(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}