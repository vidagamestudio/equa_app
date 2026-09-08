"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";

const initialState = { error: undefined as string | undefined };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="logo">
          <div className="mark" style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6d5bd0,#b18cff)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>
            A
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Estudio Aire</div>
            <div className="muted" style={{ fontSize: 12 }}>Pilates</div>
          </div>
        </div>

        <h1>Ingresar</h1>
        <p className="sub">Accedé al panel de gestión del estudio.</p>

        {state?.error && <div className="form-error">{state.error}</div>}

        <form action={formAction}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" placeholder="admin@estudioaire.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input className="input" id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} disabled={pending}>
            {pending ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <div className="divider" />
        <div className="alert">Demo: <b>admin@estudioaire.com</b> / <b>admin123</b></div>
      </div>
    </div>
  );
}