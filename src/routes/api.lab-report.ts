import { createFileRoute } from "@tanstack/react-router";
import { LAB_REPORT_MAX_BYTES, LAB_REPORT_MAX_MB, LAB_TEXT_MAX, checkLabReportFile, fileExt, type LabReportExt } from "@/lib/lab-report";

// /api/lab-report
//   GET            -> view the current lab report (add ?download=1 to download)
//   POST (admin)   -> multipart form: file (optional when only details change), labName, testedOn
//   DELETE (admin) -> remove the report

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

const fail = (error: string, status: number) => json({ error }, status);

async function adminOnly(request: Request) {
  const s = await import("@/lib/admin-session.server");
  if (!s.adminConfigured() || !s.isAdminRequest(request)) return fail("Not authorised. Please log in again.", 401);
  // Only accept requests sent from this website (the cookie is also SameSite=Strict).
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      return fail("Request blocked.", 403);
    }
    const hosts = [new URL(request.url).host, request.headers.get("host"), request.headers.get("x-forwarded-host")];
    if (!hosts.includes(originHost)) return fail("Request blocked.", 403);
  }
  return null;
}

export const Route = createFileRoute("/api/lab-report")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const s = await import("@/lib/lab-report.server");
        const meta = await s.readMeta();
        if (!meta) return new Response("No lab report has been uploaded yet.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
        let bytes: Buffer;
        try {
          bytes = await s.readReportFile(meta);
        } catch {
          return new Response("The lab report file is missing. Please upload it again.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
        }
        const download = new URL(request.url).searchParams.get("download") === "1";
        const ascii = meta.fileName.replace(/[^\x20-\x7e]|"/g, "_");
        return new Response(new Uint8Array(bytes), {
          headers: {
            "Content-Type": meta.mime,
            "Content-Length": String(bytes.byteLength),
            "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(meta.fileName)}`,
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=300",
          },
        });
      },

      POST: async ({ request }) => {
        const denied = await adminOnly(request);
        if (denied) return denied;

        const length = Number(request.headers.get("content-length") || 0);
        if (length > LAB_REPORT_MAX_BYTES + 64 * 1024) return fail(`The file is too large. Maximum size is ${LAB_REPORT_MAX_MB} MB.`, 413);

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return fail("Could not read the upload. Please try again.", 400);
        }

        const s = await import("@/lib/lab-report.server");
        const labName = s.cleanText(form.get("labName"), LAB_TEXT_MAX.labName);
        const testedOn = s.cleanText(form.get("testedOn"), LAB_TEXT_MAX.testedOn);

        const entry = form.get("file");
        let file: { bytes: Uint8Array; ext: LabReportExt; name: string } | undefined;
        if (entry && typeof entry !== "string" && entry.size > 0) {
          const problem = checkLabReportFile(entry);
          if (problem) return fail(problem, 400);
          const ext = fileExt(entry.name) as LabReportExt;
          const bytes = new Uint8Array(await entry.arrayBuffer());
          if (bytes.byteLength > LAB_REPORT_MAX_BYTES) return fail(`The file is too large. Maximum size is ${LAB_REPORT_MAX_MB} MB.`, 413);
          if (!s.contentMatches(ext, bytes)) return fail("This file does not look like a real PDF or image. It may be damaged. Please try another file.", 400);
          file = { bytes, ext, name: entry.name };
        }

        try {
          const meta = await s.queued(() => s.saveReport({ file, labName, testedOn }));
          return json({ report: s.publicInfo(meta) });
        } catch (err) {
          const msg = err instanceof Error && err.message.startsWith("Please") ? err.message : "Could not save the lab report. Please try again.";
          if (!(err instanceof Error && err.message.startsWith("Please"))) console.error("lab report save failed", err);
          return fail(msg, msg.startsWith("Please") ? 400 : 500);
        }
      },

      DELETE: async ({ request }) => {
        const denied = await adminOnly(request);
        if (denied) return denied;
        const s = await import("@/lib/lab-report.server");
        try {
          await s.queued(() => s.deleteReport());
          return json({ ok: true });
        } catch (err) {
          console.error("lab report delete failed", err);
          return fail("Could not delete the lab report. Please try again.", 500);
        }
      },
    },
  },
});
