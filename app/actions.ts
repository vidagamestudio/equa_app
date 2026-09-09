"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { loginUser, logoutUser } from "@/lib/auth";

export async function loginAction(prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }
  const ok = await loginUser(email, password);
  if (!ok) {
    return { error: "Credenciales incorrectas." };
  }
  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}

export async function registrarVentaAction(
  prev: { error: string } | null,
  formData: FormData,
) {
  const alumnaId = String(formData.get("alumnaId") ?? "");
  const concepto = String(formData.get("concepto") ?? "");
  const monto = Number(formData.get("monto") ?? 0);
  const medioPago = String(formData.get("medioPago") ?? "Transferencia");
  const tipoComprobante = String(formData.get("tipoComprobante") ?? "Factura C");
  if (!alumnaId || !concepto || !monto) {
    return { error: "Completá alumna, concepto y monto." };
  }
  await prisma.venta.create({
    data: { fecha: new Date(), alumnaId, concepto, monto, medioPago, tipoComprobante },
  });
  revalidatePath("/ventas");
  revalidatePath("/caja");
  revalidatePath("/finanzas");
  return null;
}

export async function altaAlumnaAction(
  prev: { error: string } | null,
  formData: FormData,
) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  if (!nombre) {
    return { error: "El nombre es obligatorio." };
  }
  await prisma.alumna.create({ data: { nombre, email, telefono } });
  revalidatePath("/alumnas");
  return null;
}

export async function marcarPagoProfesoraAction(
  prev: unknown,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.liquidacionProfesora.update({
    where: { id },
    data: { estado: "Pagado" },
  });
  revalidatePath("/profesoras");
  revalidatePath("/caja");
  revalidatePath("/finanzas");
}

export async function registrarGastoAction(
  prev: { error: string } | null,
  formData: FormData,
) {
  const categoria = String(formData.get("categoria") ?? "Otros");
  const concepto = String(formData.get("concepto") ?? "").trim();
  const monto = Number(formData.get("monto") ?? 0);
  if (!concepto || !monto) {
    return { error: "Completá concepto y monto." };
  }
  await prisma.gasto.create({ data: { fecha: new Date(), categoria, concepto, monto } });
  revalidatePath("/caja");
  revalidatePath("/finanzas");
  return null;
}

export async function crearAbonoAction(
  prev: { error: string } | null,
  formData: FormData,
) {
  const alumnaId = String(formData.get("alumnaId") ?? "");
  const tipo = String(formData.get("tipo") ?? "");
  const precio = Number(formData.get("precio") ?? 0);
  if (!alumnaId || !tipo || !precio) {
    return { error: "Completá alumna, tipo y precio." };
  }
  await prisma.abono.create({
    data: { alumnaId, tipo, precio, fechaInicio: new Date(), estado: "Al día" },
  });
  revalidatePath("/alumnas");
  revalidatePath("/abonos");
  return null;
}

export type ReservarResult = { error?: string; ok?: boolean; clase?: string; fecha?: string };

export async function reservarAction(
  prev: ReservarResult | null,
  formData: FormData,
): Promise<ReservarResult> {
  const claseId = String(formData.get("claseId") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;

  if (!claseId || !nombre) {
    return { error: "Elegí una clase y escribí tu nombre." };
  }

  const clase = await prisma.clase.findUnique({
    where: { id: claseId },
    include: { servicio: true, profesora: true, reservas: true },
  });
  if (!clase) {
    return { error: "La clase elegida ya no está disponible." };
  }

  const ocupadas = clase.reservas.filter((r) => r.estado === "Confirmada").length;
  if (ocupadas >= clase.servicio.cupo) {
    return { error: "Esta clase ya está completa. Elegí otra." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
  let alumna = email
    ? await prisma.alumna.findFirst({ where: { email } })
    : null;
  if (!alumna) {
    alumna = await prisma.alumna.create({
      data: { nombre, email, telefono },
    });
  }

  await prisma.reserva.create({
    data: { claseId, alumnaId: alumna.id, estado: "Confirmada" },
  });

  revalidatePath("/reservar");
  revalidatePath("/reserva");
  revalidatePath("/agenda");
  revalidatePath("/");

  return {
    ok: true,
    clase: `${clase.horaInicio} · ${clase.servicio.nombre}`,
    fecha: clase.fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
  };
}