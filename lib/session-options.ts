export const COOKIE_NAME = "estudio_aire_session";

export const SESSION_OPTIONS = {
  cookieName: COOKIE_NAME,
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
  },
};