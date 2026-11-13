import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  createdAt: string;
};

// Shared by the form (client-side checks) and the server (authoritative checks).
export const reviewInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be 50 characters or less."),
  city: z.string().trim().max(40, "City must be 40 characters or less.").optional().default(""),
  rating: z
    .number({ invalid_type_error: "Please select a rating." })
    .int("Please select a rating.")
    .min(1, "Please select a rating from 1 to 5 stars.")
    .max(5, "Please select a rating from 1 to 5 stars."),
  comment: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters.")
    .max(500, "Review must be 500 characters or less."),
  // Honeypot: real users never see or fill this field; bots usually do.
  website: z.string().max(0).optional().default(""),
});

export type ReviewInput = z.input<typeof reviewInputSchema>;

const MAX_STORED = 500;
const SHOWN = 30;

// Remove control characters and collapse runs of whitespace.
function clean(s: string) {
  const noControl = Array.from(s)
    .filter((ch) => {
      const c = ch.charCodeAt(0);
      return c === 10 || (c >= 32 && c !== 127);
    })
    .join("");
  return noControl.replace(/[ \t]+/g, " ").trim();
}

async function storePath() {
  const path = await import("node:path");
  return process.env["REVIEWS_FILE"] || path.join(process.cwd(), "data", "reviews.json");
}

async function readAll(): Promise<Review[]> {
  const fs = await import("node:fs/promises");
  try {
    const raw = await fs.readFile(await storePath(), "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Review[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(reviews: Review[]) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const file = await storePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  // Write to a temp file first, then rename, so a crash never leaves a half-written file.
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(reviews, null, 2), "utf8");
  await fs.rename(tmp, file);
}

// Serialize writes so two submissions at the same moment don't overwrite each other.
let writeQueue: Promise<unknown> = Promise.resolve();

function latest(reviews: Review[]) {
  return [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, SHOWN);
}

export const getReviews = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return latest(await readAll());
  } catch (err) {
    console.error("Failed to read reviews", err);
    return [] as Review[];
  }
});

export const addReview = createServerFn({ method: "POST" })
  .validator((input: unknown) => reviewInputSchema.parse(input))
  .handler(async ({ data }) => {
    const review: Review = {
      id: crypto.randomUUID(),
      name: clean(data.name),
      city: clean(data.city ?? ""),
      rating: data.rating,
      comment: clean(data.comment),
      createdAt: new Date().toISOString(),
    };

    const run = writeQueue.then(async () => {
      const all = await readAll();
      all.push(review);
      const kept = all.slice(-MAX_STORED);
      await writeAll(kept);
      return latest(kept);
    });
    writeQueue = run.catch(() => undefined);

    try {
      return { review, reviews: await run };
    } catch (err) {
      console.error("Failed to save review", err);
      throw new Error("Could not save your review right now. Please try again later.");
    }
  });
