import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";
import { SEED_POSTS } from "./blog-seed";
import { MORE_SEED_POSTS } from "./blog-seed-2";
import { OIL_SEED_POSTS } from "./blog-seed-oil";

const ALL_SEEDS = [...SEED_POSTS, ...MORE_SEED_POSTS, ...OIL_SEED_POSTS];
async function requireAdmin() {
  const s = await import("./admin-session.server");
  s.requireAdmin();
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  // Plain text. Blank line = new paragraph, "## " = heading, "### " = sub-heading, "- " = bullet point.
  content: string;
  // Optional questions and answers shown at the end of the article (and sent to Google as FAQ data).
  faqs?: { q: string; a: string }[];
  coverImage: string;
  author: string;
  // Optional SEO fields. When empty, the title and excerpt are used.
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostSummary = Omit<BlogPost, "content"> & { readMinutes: number };

// ---------- storage ----------

async function storePath() {
  const path = await import("node:path");
  return process.env["BLOG_FILE"] || path.join(process.cwd(), "data", "blog-posts.json");
}

// Starter articles the admin deleted, so they are not added back.
async function deletedSeedsPath() {
  return `${await storePath()}.deleted-seeds.json`;
}

async function readDeletedSeeds(): Promise<string[]> {
  const fs = await import("node:fs/promises");
  try {
    const data = JSON.parse(await fs.readFile(await deletedSeedsPath(), "utf8"));
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

async function rememberDeletedSeed(id: string) {
  if (!ALL_SEEDS.some((p) => p.id === id)) return;
  const fs = await import("node:fs/promises");
  const list = new Set(await readDeletedSeeds());
  list.add(id);
  await fs.writeFile(await deletedSeedsPath(), JSON.stringify([...list]), "utf8");
}

async function readAll(): Promise<BlogPost[]> {
  const fs = await import("node:fs/promises");
  let saved: BlogPost[];
  try {
    const data = JSON.parse(await fs.readFile(await storePath(), "utf8"));
    saved = Array.isArray(data) ? (data as BlogPost[]) : [];
  } catch (err) {
    // No file yet: show the starter articles.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return ALL_SEEDS.map((p) => ({ ...p }));
    throw err;
  }
  // Newer starter articles are added even after the admin has saved posts,
  // unless the admin deleted them or a post already uses the same address.
  const deleted = new Set(await readDeletedSeeds());
  const ids = new Set(saved.map((p) => p.id));
  const slugs = new Set(saved.map((p) => p.slug));
  const extra = ALL_SEEDS.filter((p) => !ids.has(p.id) && !slugs.has(p.slug) && !deleted.has(p.id)).map((p) => ({ ...p }));
  return [...saved, ...extra];
}

async function writeAll(posts: BlogPost[]) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const file = await storePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(posts, null, 2), "utf8");
  await fs.rename(tmp, file);
}

let writeQueue: Promise<unknown> = Promise.resolve();
function queued<T>(fn: () => Promise<T>) {
  const run = writeQueue.then(fn);
  writeQueue = run.catch(() => undefined);
  return run;
}

function readMinutes(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function summary(p: BlogPost): BlogPostSummary {
  const { content, ...rest } = p;
  return { ...rest, readMinutes: readMinutes(content) };
}

function newestFirst(a: BlogPost, b: BlogPost) {
  return b.createdAt.localeCompare(a.createdAt);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ---------- public ----------

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return (await readAll()).filter((p) => p.published).sort(newestFirst).map(summary);
  } catch (err) {
    console.error("Failed to read blog posts", err);
    return [] as BlogPostSummary[];
  }
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data }) => {
    const all = await readAll();
    const post = all.find((p) => p.slug === data.slug && p.published);
    if (!post) throw notFound();
    // Related = articles sharing the most keywords, then the newest.
    const words = (p: BlogPost) => new Set((p.keywords ?? "").toLowerCase().split(",").map((k) => k.trim()).filter(Boolean));
    const mine = words(post);
    const overlap = (p: BlogPost) => [...words(p)].filter((k) => mine.has(k)).length;
    const related = all
      .filter((p) => p.published && p.id !== post.id)
      .sort((a, b) => overlap(b) - overlap(a) || newestFirst(a, b))
      .slice(0, 3)
      .map(summary);
    return { post, related, readMinutes: readMinutes(post.content) };
  });

// ---------- admin ----------

export const postInputSchema = z.object({
  id: z.string().max(100).optional(),
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(150, "Title must be 150 characters or less."),
  slug: z
    .string()
    .trim()
    .max(80, "URL must be 80 characters or less.")
    .regex(/^[a-z0-9-]*$/, "URL can only contain small letters, numbers and dashes.")
    .optional()
    .default(""),
  excerpt: z.string().trim().min(10, "Short summary must be at least 10 characters.").max(300, "Short summary must be 300 characters or less."),
  content: z.string().trim().min(50, "Article must be at least 50 characters.").max(30000, "Article is too long."),
  coverImage: z
    .string()
    .trim()
    .max(500)
    // A full https:// link, or a picture already on this site (starts with a single "/").
    .refine((v) => v === "" || /^https:\/\//.test(v) || /^\/(?!\/)/.test(v), "Image link must start with https://")
    .optional()
    .default(""),
  author: z.string().trim().max(60).optional().default(""),
  metaTitle: z.string().trim().max(70, "SEO title must be 70 characters or less.").optional().default(""),
  metaDescription: z.string().trim().max(170, "Meta description must be 170 characters or less.").optional().default(""),
  keywords: z.string().trim().max(300, "Keywords must be 300 characters or less.").optional().default(""),
  faqs: z
    .array(
      z.object({
        q: z.string().trim().min(5, "Each FAQ question needs at least 5 characters.").max(200, "FAQ questions must be 200 characters or less."),
        a: z.string().trim().min(5, "Each FAQ answer needs at least 5 characters.").max(1000, "FAQ answers must be 1000 characters or less."),
      }),
    )
    .max(15, "Up to 15 FAQs per article.")
    .optional()
    .default([]),
  published: z.boolean(),
});

export type PostInput = z.input<typeof postInputSchema>;

export const adminListPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return (await readAll()).sort(newestFirst);
});

export const adminSavePost = createServerFn({ method: "POST" })
  .validator((input: unknown) => postInputSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return queued(async () => {
      const all = await readAll();
      const slug = slugify(data.slug || data.title) || `post-${Date.now()}`;
      if (all.some((p) => p.slug === slug && p.id !== data.id)) {
        throw new Error("Another post already uses this URL. Please change the title or URL.");
      }
      const now = new Date().toISOString();
      const fields = {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage ?? "",
        author: data.author || "Haryanvi Desi Ghee",
        metaTitle: data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        keywords: data.keywords ?? "",
        faqs: data.faqs ?? [],
        published: data.published,
      };
      let saved: BlogPost;
      const idx = data.id ? all.findIndex((p) => p.id === data.id) : -1;
      const existing = idx >= 0 ? all[idx] : undefined;
      if (existing) {
        saved = { ...existing, ...fields, updatedAt: now };
        all[idx] = saved;
      } else {
        saved = { id: crypto.randomUUID(), ...fields, createdAt: now, updatedAt: now };
        all.push(saved);
      }
      await writeAll(all);
      return saved;
    });
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return queued(async () => {
      const all = await readAll();
      const next = all.filter((p) => p.id !== data.id);
      if (next.length === all.length) throw new Error("Post not found.");
      await writeAll(next);
      await rememberDeletedSeed(data.id);
      return { ok: true };
    });
  });
