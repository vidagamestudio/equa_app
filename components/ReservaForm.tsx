"use client";

import { useActionState, useState } from "react";
import { reservarAction } from "@/app/actions";

type Clase = {
  id: string;
  horaInicio: string;
  servicio: { nombre: string };
  profesora: { nombre: string };
  cupo: number;
  ocupadas: number;
  fecha: string;
};

export function ReservaForm({ clases }: { clases: Clase[] }) {
  const [selected, setSelected] = useState<string>(clases[0]?.id ?? "");
  const [state, formAction, pending] = useActionState(reservarAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="claseId" value={selected} />

      <div className="field">
        <label>Clase</label>
        <select
          className="input"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {clases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fecha} · {c.horaInicio} · {c.servicio.nombre} — {c.ocupadas}/{c.cupo} ocupados
            </option>
          ))}
        </select>
      </div>

      {state?.error && <div className="form-error">{state.error}</div>}
      {state?.ok && !pending && (
        <div className="alert mb">
          ¡Reserva confirmada para <b>{state.clase}</b> ({state.fecha})! Te esperamos.
        </div>
      )}

      {!state?.ok && (
        <>
          <div className="field">
            <label>Tu nombre</label>
            <input className="input" name="nombre" required placeholder="Nombre y apellido" />
          </div>
          <div className="field">
            <label>Teléfono (opcional)</label>
            <input className="input" name="telefono" placeholder="11 5555 5555" />
          </div>
          <div className="field">
            <label>Email (opcional)</label>
            <input className="input" name="email" type="email" placeholder="tumail@correo.com" />
          </div>
          <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={pending}>
            {pending ? "Reservando…" : "Confirmar reserva"}
          </button>
        </>
      )}
    </form>
  );
}