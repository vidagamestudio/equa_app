"use client";

import { useActionState, useState } from "react";
import { registrarVentaAction } from "@/app/actions";

const initialState = null as { error: string } | null;

export function RegistrarVentaForm({ alumnas }: { alumnas: { id: string; nombre: string }[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(registrarVentaAction, initialState);

  if (!open) {
    return <button className="btn primary" onClick={() => setOpen(true)}>+ Nueva venta</button>;
  }

  return (
    <div className="card card-pad" style={{ width: 340 }}>
      <form action={formAction}>
        {state?.error && <div className="form-error">{state.error}</div>}
        {state === null && !pending && <div className="alert mb">Venta registrada ✔</div>}
        <div className="field">
          <label>Alumna</label>
          <select className="input" name="alumnaId" required>
            <option value="">Seleccionar…</option>
            {alumnas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Concepto</label>
          <input className="input" name="concepto" placeholder="Pack 8 clases" required />
        </div>
        <div className="field">
          <label>Monto</label>
          <input className="input" name="monto" type="number" min={0} required />
        </div>
        <div className="field">
          <label>Medio de pago</label>
          <select className="input" name="medioPago" defaultValue="Transferencia">
            <option>Transferencia</option>
            <option>Efectivo</option>
            <option>Tarjeta</option>
          </select>
        </div>
        <div className="field">
          <label>Comprobante</label>
          <select className="input" name="tipoComprobante" defaultValue="Factura C">
            <option>Factura C</option>
            <option>Recibo</option>
          </select>
        </div>
        <div className="flex">
          <button className="btn primary" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
          <button type="button" className="btn" onClick={() => setOpen(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}