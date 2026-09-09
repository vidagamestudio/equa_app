import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: `Ingresar · ${brand.name}` };

export default function LoginPage() {
  return <LoginForm />;
}