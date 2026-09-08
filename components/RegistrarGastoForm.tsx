"use client";

import { useActionState, useState } from "react";
import { registrarGastoAction } from "@/app/actions";

const initialState = null as { error: string } | null;

export function RegistrarGastoForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(registrarGastoAction, initialState);

  if (!open) {
    return <button className="btn" onClick={() => setOpen(true)}>+ Registrar gasto</button>;
  }

  return (
    <div className="card card-pad" style={{ width: 320 }}>
      <form action={formAction}>
        {state?.error && <div className="form-error">{state.error}</div>}
        {state === null && !pending && <div className="alert mb">Gasto registrado ✔</div>}
        <div className="field">
          <label>Categoría</label>
          <select className="input" name="categoria" defaultValue="Otros">
            <option>Alquiler</option>
            <option>Insumos</option>
            <option>Otros</option>
          </select>
        </div>
        <div className="field">
          <label>Concepto</label>
          <input className="input" name="concepto" placeholder="Ej. Internet y servicios" required />
        </div>
        <div className="field">
          <label>Monto</label>
          <input className="input" name="monto" type="number" min={0} required />
        </div>
        <div className="flex">
          <button className="btn primary" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
          <button type="button" className="btn" onClick={() => setOpen(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}