import "server-only";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { SESSION_OPTIONS } from "@/lib/session-options";

export type SessionData = {
  userId?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getCurrentUser(): Promise<User> {
  const session = await getSession();
  if (!session.userId) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function loginUser(email: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return false;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return false;
  }
  const session = await getSession();
  session.userId = user.id;
  await session.save();
  return true;
}

export async function logoutUser(): Promise<void> {
  const session = await getSession();
  session.destroy();
}