import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Admin login server functions. The real logic lives in admin-session.server.ts,
// loaded only on the server inside each handler.

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const s = await import("./admin-session.server");
  return { configured: s.adminConfigured(), loggedIn: s.isAdmin() };
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const s = await import("./admin-session.server");
    s.login(data.password);
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const s = await import("./admin-session.server");
  s.logout();
  return { ok: true };
});
