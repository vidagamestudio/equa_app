export const brand = {
  name: process.env.NEXT_PUBLIC_STUDIO_NAME ?? "Estudio Aire",
  subtitle: process.env.NEXT_PUBLIC_STUDIO_SUBTITLE ?? "Pilates · Gestión",
  short: process.env.NEXT_PUBLIC_STUDIO_SHORT ?? "Pilates",
  city: process.env.NEXT_PUBLIC_STUDIO_CITY ?? "Buenos Aires",
  mark: (process.env.NEXT_PUBLIC_STUDIO_MARK ?? "A").slice(0, 1).toUpperCase(),
  accent: process.env.NEXT_PUBLIC_STUDIO_ACCENT ?? "#6d5bd0",
  accentStrong: process.env.NEXT_PUBLIC_STUDIO_ACCENT_STRONG ?? "#5a49b8",
  accentSoft: process.env.NEXT_PUBLIC_STUDIO_ACCENT_SOFT ?? "#efeefb",
};

// Paleta generada a partir del color de acento para elementos derivados.
export function accentPalette() {
  return brand;
}