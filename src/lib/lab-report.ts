import { createServerFn } from "@tanstack/react-start";

// Lab report shown on the /lab-tested page. The admin uploads it in /admin;
// the file is served from /api/lab-report (add ?download=1 to download it).

export const LAB_REPORT_TYPES = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;
export type LabReportExt = keyof typeof LAB_REPORT_TYPES;

export const LAB_REPORT_MAX_MB = 10;
export const LAB_REPORT_MAX_BYTES = LAB_REPORT_MAX_MB * 1024 * 1024;
export const LAB_REPORT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";
export const LAB_TEXT_MAX = { labName: 120, testedOn: 60 } as const;

export const LAB_REPORT_URL = "/api/lab-report";

export type LabReportInfo = {
  fileName: string;
  mime: string;
  size: number;
  labName: string;
  testedOn: string;
  uploadedAt: string;
  updatedAt: string;
  // View link; add "&download=1" to download.
  url: string;
};

export function fileExt(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

/** Checks name, type and size. Returns an error message, or "" when the file is fine. */
export function checkLabReportFile(file: { name: string; size: number; type: string }) {
  const ext = fileExt(file.name);
  if (!(ext in LAB_REPORT_TYPES)) return "Only PDF, JPG, PNG or WEBP files can be uploaded.";
  if (file.type && file.type !== "application/octet-stream" && file.type !== LAB_REPORT_TYPES[ext as LabReportExt]) {
    return "The file type does not match its name. Please upload a real PDF or image file.";
  }
  if (file.size <= 0) return "The file is empty.";
  if (file.size > LAB_REPORT_MAX_BYTES) return `The file is too large. Maximum size is ${LAB_REPORT_MAX_MB} MB.`;
  return "";
}

export function formatBytes(n: number) {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

export const getLabReport = createServerFn({ method: "GET" }).handler(async (): Promise<LabReportInfo | null> => {
  const s = await import("./lab-report.server");
  return s.publicInfo(await s.readMeta());
});
