// Server-only storage for the lab report. Import only with `await import(...)`
// inside server handlers.
import fs from "node:fs/promises";
import path from "node:path";
import { LAB_REPORT_TYPES, LAB_REPORT_URL, type LabReportExt, type LabReportInfo } from "./lab-report";

export type LabReportMeta = {
  storedName: string; // file name on disk
  fileName: string; // original name, cleaned
  mime: string;
  size: number;
  labName: string;
  testedOn: string;
  uploadedAt: string;
  updatedAt: string;
};

function dir() {
  return process.env["LAB_REPORT_DIR"] || path.join(process.cwd(), "data", "lab-report");
}
const metaFile = () => path.join(dir(), "meta.json");

export async function readMeta(): Promise<LabReportMeta | null> {
  try {
    const m = JSON.parse(await fs.readFile(metaFile(), "utf8")) as LabReportMeta;
    return m && typeof m.storedName === "string" ? m : null;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function writeMeta(m: LabReportMeta) {
  await fs.mkdir(dir(), { recursive: true });
  const tmp = `${metaFile()}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(m, null, 2), "utf8");
  await fs.rename(tmp, metaFile());
}

export function publicInfo(m: LabReportMeta | null): LabReportInfo | null {
  if (!m) return null;
  const { storedName: _stored, ...rest } = m;
  return { ...rest, url: `${LAB_REPORT_URL}?v=${Date.parse(m.updatedAt) || 0}` };
}

/** Confirms the bytes really are the claimed type (PDF / JPEG / PNG / WEBP). */
export function contentMatches(ext: LabReportExt, b: Uint8Array) {
  const ascii = (start: number, len: number) => String.fromCharCode(...b.subarray(start, start + len));
  switch (ext) {
    case "pdf":
      return ascii(0, 1024).includes("%PDF-");
    case "jpg":
    case "jpeg":
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "png":
      return b[0] === 0x89 && ascii(1, 3) === "PNG";
    case "webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP";
  }
}

export function cleanText(s: unknown, max: number) {
  return String(s ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

export function cleanFileName(name: string, ext: string) {
  const base = name.replace(/\.[^.]*$/, "").replace(/[^\w\- ()]+/g, "_").replace(/\s+/g, " ").trim().slice(0, 80);
  return `${base || "lab-report"}.${ext}`;
}

// One write at a time so two uploads cannot mix files and details.
let queue: Promise<unknown> = Promise.resolve();
export function queued<T>(fn: () => Promise<T>) {
  const run = queue.then(fn);
  queue = run.catch(() => undefined);
  return run;
}

export async function saveReport(opts: { file?: undefined | { bytes: Uint8Array; ext: LabReportExt; name: string }; labName: string; testedOn: string }) {
  const old = await readMeta();
  const now = new Date().toISOString();
  if (!opts.file) {
    if (!old) throw new Error("Please choose a lab report file to upload.");
    const next = { ...old, labName: opts.labName, testedOn: opts.testedOn, updatedAt: now };
    await writeMeta(next);
    return next;
  }
  await fs.mkdir(dir(), { recursive: true });
  const storedName = `report-${Date.now()}.${opts.file.ext}`;
  await fs.writeFile(path.join(dir(), storedName), opts.file.bytes);
  const next: LabReportMeta = {
    storedName,
    fileName: cleanFileName(opts.file.name, opts.file.ext),
    mime: LAB_REPORT_TYPES[opts.file.ext],
    size: opts.file.bytes.byteLength,
    labName: opts.labName,
    testedOn: opts.testedOn,
    uploadedAt: now,
    updatedAt: now,
  };
  await writeMeta(next);
  if (old && old.storedName !== storedName) await fs.rm(path.join(dir(), path.basename(old.storedName)), { force: true });
  return next;
}

export async function deleteReport() {
  const old = await readMeta();
  await fs.rm(metaFile(), { force: true });
  if (old) await fs.rm(path.join(dir(), path.basename(old.storedName)), { force: true });
}

export async function readReportFile(m: LabReportMeta) {
  return fs.readFile(path.join(dir(), path.basename(m.storedName)));
}
