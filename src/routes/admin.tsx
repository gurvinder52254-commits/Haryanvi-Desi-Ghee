import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout, getAdminStatus } from "@/lib/admin-auth";
import { adminDeletePost, adminListPosts, adminSavePost, postInputSchema, slugify, type BlogPost, type PostInput } from "@/lib/blog";
import { formatDate } from "@/components/article-body";
import { LAB_REPORT_ACCEPT, LAB_REPORT_MAX_MB, LAB_REPORT_URL, LAB_TEXT_MAX, checkLabReportFile, formatBytes, getLabReport, type LabReportInfo } from "@/lib/lab-report";
import { adminSeoAudit, type SeoAuditResult } from "@/lib/seo-audit";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin – Haryanvi Desi Ghee" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => getAdminStatus(),
  component: AdminPage,
});

function errMessage(e: unknown, fallback: string) {
  return e instanceof Error && e.message && !e.message.startsWith("[") ? e.message : fallback;
}

const input = "mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const btnPrimary = "rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";
const btnGhost = "rounded-full border border-border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:bg-secondary disabled:opacity-60";

function AdminPage() {
  const status = Route.useLoaderData();
  const [loggedIn, setLoggedIn] = useState(status.loggedIn);

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <a href="/" className="font-display text-2xl font-bold text-primary">
            Haryanvi <span className="text-earth">Desi Ghee</span> <span className="text-base font-sans font-semibold text-muted-foreground">· Admin</span>
          </a>
          <div className="flex gap-2">
            <a href="/blog" target="_blank" rel="noopener noreferrer" className={btnGhost}>View Blog</a>
            {loggedIn && (
              <button
                className={btnGhost}
                onClick={async () => {
                  await adminLogout();
                  setLoggedIn(false);
                }}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        {!status.configured ? (
          <Notice>
            Admin login is not set up yet. Add an environment variable named <code className="rounded bg-secondary px-1.5 py-0.5">ADMIN_PASSWORD</code> on your server (for example in Render → Environment) and restart the website.
          </Notice>
        ) : loggedIn ? (
          <AdminTabs onSessionExpired={() => setLoggedIn(false)} />
        ) : (
          <LoginForm onLoggedIn={() => setLoggedIn(true)} />
        )}
      </main>
    </div>
  );
}

const TABS = [
  { id: "blog", label: "Blog Posts" },
  { id: "lab", label: "Lab Report" },
  { id: "seo", label: "SEO Check" },
] as const;

function AdminTabs({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("blog");
  return (
    <div>
      <div role="tablist" aria-label="Admin sections" className="mb-8 inline-flex rounded-full bg-card p-1 shadow-warm">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "blog" && <BlogManager onSessionExpired={onSessionExpired} />}
      {tab === "lab" && <LabReportManager onSessionExpired={onSessionExpired} />}
      {tab === "seo" && <SeoChecker onSessionExpired={onSessionExpired} />}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-xl rounded-2xl bg-card p-8 text-center text-foreground shadow-warm">{children}</div>;
}

function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto max-w-md rounded-2xl bg-card p-8 shadow-warm"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!password) return setError("Please enter the password.");
        setBusy(true);
        setError("");
        try {
          await adminLogin({ data: { password } });
          setPassword("");
          onLoggedIn();
        } catch (err) {
          setError(errMessage(err, "Login failed. Please try again."));
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="text-center font-display text-3xl font-bold text-primary">Admin Login</h1>
      <p className="mt-2 text-center text-muted-foreground">Log in to manage blog posts and the lab report.</p>
      <label className="mt-6 block text-sm font-semibold text-primary">
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </label>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={busy} className={`${btnPrimary} mt-6 w-full`}>{busy ? "Logging in..." : "Log in"}</button>
    </form>
  );
}

const EMPTY: PostInput = { title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", metaTitle: "", metaDescription: "", keywords: "", faqs: [], published: true };

const FAQ_PLACEHOLDER = ["Q: Is desi ghee good for health?", "A: In small amounts, pure desi ghee can be part of a balanced diet...", "", "Q: What is the GST rate on ghee?", "A: ..."].join("\n");

// FAQs are typed as "Q: question" then "A: answer" lines, with a blank line between pairs.
function faqsToText(faqs: PostInput["faqs"]) {
  return (faqs ?? []).map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}

function textToFaqs(text: string): { faqs: { q: string; a: string }[]; error: string } {
  const faqs: { q: string; a: string }[] = [];
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  for (const [i, block] of blocks.entries()) {
    const m = block.match(/^Q:\s*([\s\S]*?)\n\s*A:\s*([\s\S]+)$/i);
    if (!m) return { faqs: [], error: `FAQ ${i + 1}: write it as "Q: question" on one line and "A: answer" on the next.` };
    faqs.push({ q: (m[1] ?? "").trim(), a: (m[2] ?? "").trim().replace(/\s*\n\s*/g, " ") });
  }
  return { faqs, error: "" };
}

function BlogManager({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [editing, setEditing] = useState<PostInput | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    try {
      setPosts(await adminListPosts());
    } catch (err) {
      const msg = errMessage(err, "Could not load posts.");
      if (msg.startsWith("Not authorised")) onSessionExpired();
      else setError(msg);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (editing) {
    return (
      <PostEditor
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={(p) => {
          setEditing(null);
          setNotice(`"${p.title}" saved.`);
          load();
        }}
        onSessionExpired={onSessionExpired}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">Blog Posts</h1>
          <p className="text-muted-foreground">Add, edit or delete articles shown on the Blog page.</p>
        </div>
        <button className={btnPrimary} onClick={() => { setNotice(""); setEditing({ ...EMPTY }); }}>+ New Post</button>
      </div>
      {notice && <p role="status" className="mt-6 rounded-xl bg-primary/10 px-4 py-3 text-primary">{notice}</p>}
      {error && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-destructive">{error}</p>}
      {posts === null ? (
        <p className="mt-10 text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <Notice>No posts yet. Click "New Post" to write your first article.</Notice>
      ) : (
        <ul className="mt-8 space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-warm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.published ? "bg-whatsapp/15 text-whatsapp" : "bg-muted text-muted-foreground"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                </div>
                <p className="mt-1 break-words text-lg font-bold text-primary">{p.title}</p>
                <p className="break-all text-sm text-muted-foreground">/blog/{p.slug}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {p.published && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>View</a>}
                <button className={btnGhost} onClick={() => { setNotice(""); setEditing({ ...EMPTY, ...p }); }}>Edit</button>
                <button
                  className={`${btnGhost} text-destructive`}
                  onClick={async () => {
                    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                    setError("");
                    try {
                      await adminDeletePost({ data: { id: p.id } });
                      setNotice(`"${p.title}" deleted.`);
                      load();
                    } catch (err) {
                      const msg = errMessage(err, "Could not delete the post.");
                      if (msg.startsWith("Not authorised")) onSessionExpired();
                      else setError(msg);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Errors = Partial<Record<keyof PostInput, string>>;

function PostEditor({ initial, onCancel, onSaved, onSessionExpired }: { initial: PostInput; onCancel: () => void; onSaved: (p: BlogPost) => void; onSessionExpired: () => void }) {
  const [form, setForm] = useState<PostInput>(initial);
  const [faqText, setFaqText] = useState(() => faqsToText(initial.faqs));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = !initial.id;
  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const previewSlug = slugify(form.slug || form.title);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsedFaqs = textToFaqs(faqText);
    if (parsedFaqs.error) {
      setErrors({ faqs: parsedFaqs.error });
      setFormError("Please fix the highlighted fields.");
      return;
    }
    const data = { ...form, slug: form.slug ? slugify(form.slug) : "", faqs: parsedFaqs.faqs };
    const parsed = postInputSchema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as keyof PostInput;
        if (!next[k]) next[k] = i.message;
      }
      setErrors(next);
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      onSaved(await adminSavePost({ data }));
    } catch (err) {
      const msg = errMessage(err, "Could not save the post. Please try again.");
      if (msg.startsWith("Not authorised")) onSessionExpired();
      else setFormError(msg);
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof PostInput) => errors[k] && <span className="mt-1 block text-sm font-normal text-destructive">{errors[k]}</span>;
  const cls = (k: keyof PostInput) => `${input} ${errors[k] ? "border-destructive" : ""}`;

  return (
    <form onSubmit={save} noValidate className="rounded-2xl bg-card p-6 shadow-warm sm:p-8">
      <h1 className="font-display text-3xl font-bold text-primary">{isNew ? "New Post" : "Edit Post"}</h1>
      <div className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-primary">
          Title *
          <input value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={150} className={cls("title")} />
          {err("title")}
        </label>
        <label className="block text-sm font-semibold text-primary">
          Page URL <span className="font-normal text-muted-foreground">(optional, made from the title if empty)</span>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} maxLength={80} placeholder="e.g. benefits-of-desi-ghee" className={cls("slug")} />
          <span className="mt-1 block break-all text-xs font-normal text-muted-foreground">/blog/{previewSlug || "..."}</span>
          {err("slug")}
        </label>
        <label className="block text-sm font-semibold text-primary">
          Short Summary *
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} maxLength={300} rows={2} className={cls("excerpt")} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">Shown on the blog list and in Google results. {form.excerpt.trim().length}/300</span>
          {err("excerpt")}
        </label>
        <label className="block text-sm font-semibold text-primary">
          Article *
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={16} className={`${cls("content")} font-mono text-sm`} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            Leave an empty line between paragraphs. Start a line with <code>## </code> for a heading, <code>### </code> for a sub-heading, or <code>- </code> for a bullet point. Add a link like <code>[desi ghee price](/blog/desi-ghee-price-1kg-in-india)</code>.
          </span>
          {err("content")}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-primary">
            Cover Image Link <span className="font-normal text-muted-foreground">(optional)</span>
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." className={cls("coverImage")} />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">If empty, a photo from the website is used.</span>
            {err("coverImage")}
          </label>
          <label className="block text-sm font-semibold text-primary">
            Author <span className="font-normal text-muted-foreground">(optional)</span>
            <input value={form.author} onChange={(e) => set("author", e.target.value)} maxLength={60} placeholder="Haryanvi Desi Ghee" className={cls("author")} />
          </label>
        </div>
        <fieldset className="rounded-xl border border-border p-4 sm:p-5">
          <legend className="px-2 text-sm font-semibold text-primary">Google Search (SEO) <span className="font-normal text-muted-foreground">(optional)</span></legend>
          <div className="space-y-5">
            <label className="block text-sm font-semibold text-primary">
              SEO Title
              <input value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} maxLength={70} placeholder={form.title || "e.g. Desi Ghee Price 1kg in India"} className={cls("metaTitle")} />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Blue headline in Google. Best under 60 characters, main keyword first. {(form.metaTitle ?? "").trim().length}/70</span>
              {err("metaTitle")}
            </label>
            <label className="block text-sm font-semibold text-primary">
              Meta Description
              <textarea value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} maxLength={170} rows={2} placeholder="If empty, the short summary is used." className={cls("metaDescription")} />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Grey text under the headline in Google. Best 120 to 160 characters. {(form.metaDescription ?? "").trim().length}/170</span>
              {err("metaDescription")}
            </label>
            <label className="block text-sm font-semibold text-primary">
              Keywords
              <input value={form.keywords ?? ""} onChange={(e) => set("keywords", e.target.value)} maxLength={300} placeholder="desi ghee price 1kg, shudh desi ghee, desi cow ghee" className={cls("keywords")} />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Separate with commas. Also use these words naturally in the title, headings and article.</span>
              {err("keywords")}
            </label>
          </div>
        </fieldset>
        <label className="block text-sm font-semibold text-primary">
          FAQs <span className="font-normal text-muted-foreground">(optional, shown at the end of the article and sent to Google)</span>
          <textarea value={faqText} onChange={(e) => setFaqText(e.target.value)} rows={8} placeholder={FAQ_PLACEHOLDER} className={`${cls("faqs")} font-mono text-sm`} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">Write each question on a line starting with <code>Q:</code> and its answer on the next line starting with <code>A:</code>. Leave an empty line between FAQs. Up to 15.</span>
          {err("faqs")}
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-primary">
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="h-5 w-5 accent-[var(--color-primary)]" />
          Published (show on the website). Untick to save as a draft.
        </label>
      </div>
      {formError && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Saving..." : "Save Post"}</button>
        <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </form>
  );
}

// ---------- Lab report ----------

type UploadResult = { status: number; body: { report?: LabReportInfo; error?: string; ok?: boolean } };

// XMLHttpRequest instead of fetch so the admin sees upload progress.
function sendLabReport(method: "POST" | "DELETE", body: FormData | null, onProgress?: (pct: number) => void) {
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, LAB_REPORT_URL);
    xhr.withCredentials = true;
    if (onProgress) xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let parsed: UploadResult["body"] = {};
      try {
        parsed = JSON.parse(xhr.responseText || "{}");
      } catch {
        parsed = { error: xhr.status === 413 ? `The file is too large. Maximum size is ${LAB_REPORT_MAX_MB} MB.` : "" };
      }
      resolve({ status: xhr.status, body: parsed });
    };
    xhr.onerror = () => reject(new Error("Network error. Please check your internet connection and try again."));
    xhr.send(body);
  });
}

function LabReportManager({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [report, setReport] = useState<LabReportInfo | null | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [labName, setLabName] = useState("");
  const [testedOn, setTestedOn] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputKey, setInputKey] = useState(0);

  async function load() {
    try {
      const r = await getLabReport();
      setReport(r);
      setLabName(r?.labName ?? "");
      setTestedOn(r?.testedOn ?? "");
    } catch {
      setReport(null);
      setError("Could not load the lab report.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  // Local preview for a chosen image.
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pick(f: File | null) {
    setNotice("");
    setError("");
    if (!f) {
      setFile(null);
      setFileError("");
      return;
    }
    const problem = checkLabReportFile(f);
    setFileError(problem);
    setFile(problem ? null : f);
  }

  function clearFile() {
    setFile(null);
    setFileError("");
    setInputKey((k) => k + 1);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (fileError) return;
    if (!file && !report) {
      setFileError("Please choose a lab report file (PDF, JPG, PNG or WEBP).");
      return;
    }
    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("labName", labName.trim());
    fd.append("testedOn", testedOn.trim());
    setBusy(true);
    setProgress(0);
    try {
      const res = await sendLabReport("POST", fd, file ? setProgress : undefined);
      if (res.status === 401) return onSessionExpired();
      if (res.status !== 200 || !res.body.report) {
        setError(res.body.error || "Could not save the lab report. Please try again.");
        return;
      }
      setReport(res.body.report);
      setNotice(file ? (report ? "Lab report replaced. The website now shows the new report." : "Lab report uploaded. It is now shown on the Lab Tested page.") : "Lab report details updated.");
      clearFile();
    } catch (err) {
      setError(errMessage(err, "Could not save the lab report. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete the lab report? It will be removed from the website.")) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const res = await sendLabReport("DELETE", null);
      if (res.status === 401) return onSessionExpired();
      if (res.status !== 200) {
        setError(res.body.error || "Could not delete the lab report.");
        return;
      }
      setReport(null);
      setLabName("");
      setTestedOn("");
      setNotice("Lab report deleted. The Lab Tested page now asks customers to request it on WhatsApp.");
    } catch (err) {
      setError(errMessage(err, "Could not delete the lab report."));
    } finally {
      setBusy(false);
    }
  }

  const detailsChanged = !!report && (labName.trim() !== report.labName || testedOn.trim() !== report.testedOn);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">Lab Report</h1>
          <p className="text-muted-foreground">Upload the lab test report shown on the Lab Tested 100% Pure page.</p>
        </div>
        <a href="/lab-tested" target="_blank" rel="noopener noreferrer" className={btnGhost}>View Lab Tested page</a>
      </div>
      {notice && <p role="status" className="mt-6 rounded-xl bg-primary/10 px-4 py-3 text-primary">{notice}</p>}
      {error && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-destructive">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Current report */}
        <section className="rounded-2xl bg-card p-6 shadow-warm sm:p-8">
          <h2 className="font-display text-2xl font-bold text-primary">Current report</h2>
          {report === undefined ? (
            <p className="mt-4 text-muted-foreground">Loading...</p>
          ) : report === null ? (
            <p className="mt-4 rounded-xl bg-secondary px-4 py-6 text-center text-muted-foreground">No lab report uploaded yet. Customers are asked to request it on WhatsApp.</p>
          ) : (
            <div className="mt-4">
              {report.mime.startsWith("image/") ? (
                <img src={report.url} alt="Current lab report" className="max-h-80 w-full rounded-xl border border-border bg-secondary object-contain" />
              ) : (
                <div className="flex items-center gap-4 rounded-xl bg-secondary p-5">
                  <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md bg-destructive/90 text-xs font-bold text-white">PDF</span>
                  <span className="min-w-0 break-words font-semibold text-primary">{report.fileName}</span>
                </div>
              )}
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">File</dt>
                <dd className="min-w-0 break-words font-medium">{report.fileName} · {formatBytes(report.size)}</dd>
                <dt className="text-muted-foreground">Lab</dt>
                <dd className="font-medium">{report.labName || "—"}</dd>
                <dt className="text-muted-foreground">Tested on</dt>
                <dd className="font-medium">{report.testedOn || "—"}</dd>
                <dt className="text-muted-foreground">Uploaded</dt>
                <dd className="font-medium">{formatDate(report.uploadedAt)}</dd>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={report.url} target="_blank" rel="noopener noreferrer" className={btnGhost}>View</a>
                <a href={`${report.url}&download=1`} className={btnGhost}>Download</a>
                <button type="button" disabled={busy} onClick={remove} className={`${btnGhost} text-destructive`}>Delete</button>
              </div>
            </div>
          )}
        </section>

        {/* Upload / update */}
        <form onSubmit={save} noValidate className="rounded-2xl bg-card p-6 shadow-warm sm:p-8">
          <h2 className="font-display text-2xl font-bold text-primary">{report ? "Replace or update" : "Upload report"}</h2>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-semibold text-primary">
              Report file {report ? <span className="font-normal text-muted-foreground">(choose a new file only to replace it)</span> : "*"}
              <input
                key={inputKey}
                id="lab-report-file"
                type="file"
                accept={LAB_REPORT_ACCEPT}
                onChange={(e) => pick(e.target.files?.[0] ?? null)}
                className={`${input} cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground ${fileError ? "border-destructive" : ""}`}
              />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">PDF, JPG, PNG or WEBP. Maximum {LAB_REPORT_MAX_MB} MB.</span>
              {fileError && <span role="alert" className="mt-1 block text-sm font-normal text-destructive">{fileError}</span>}
            </label>
            {file && (
              <div className="flex items-center gap-4 rounded-xl border border-border p-3">
                {preview ? (
                  <img src={preview} alt="Selected file preview" className="h-20 w-20 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-20 w-16 shrink-0 items-center justify-center rounded-md bg-destructive/90 text-xs font-bold text-white">PDF</span>
                )}
                <div className="min-w-0 flex-1 text-sm">
                  <p className="break-words font-semibold text-primary">{file.name}</p>
                  <p className="text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <button type="button" onClick={clearFile} className="text-sm font-semibold text-destructive">Remove</button>
              </div>
            )}
            <label className="block text-sm font-semibold text-primary">
              Lab name <span className="font-normal text-muted-foreground">(optional)</span>
              <input id="lab-name" value={labName} onChange={(e) => setLabName(e.target.value)} maxLength={LAB_TEXT_MAX.labName} placeholder="e.g. ABC Food Testing Lab, Chandigarh" className={input} />
            </label>
            <label className="block text-sm font-semibold text-primary">
              Tested on <span className="font-normal text-muted-foreground">(optional)</span>
              <input id="lab-tested-on" value={testedOn} onChange={(e) => setTestedOn(e.target.value)} maxLength={LAB_TEXT_MAX.testedOn} placeholder="e.g. October 2026" className={input} />
            </label>
          </div>
          {busy && file && (
            <div className="mt-6" aria-live="polite">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Uploading... {progress}%</p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" disabled={busy || (!file && !!report && !detailsChanged)} className={btnPrimary}>
              {busy ? "Saving..." : file ? (report ? "Replace Report" : "Upload Report") : report ? "Save Details" : "Upload Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- SEO Check ----------

const enc = encodeURIComponent;
const GSC_PROPERTY = `${SITE.url}/`;

// Free Google/Bing tools, opened for one page.
function pageTools(url: string) {
  return [
    { label: "Indexed? (Search Console)", href: `https://search.google.com/search-console/inspect?resource_id=${enc(GSC_PROPERTY)}&id=${enc(url)}` },
    { label: "Rich Results Test", href: `https://search.google.com/test/rich-results?url=${enc(url)}` },
    { label: "PageSpeed", href: `https://pagespeed.web.dev/analysis?url=${enc(url)}` },
  ];
}

const SITE_TOOLS = [
  { label: "Rankings & clicks", note: "Search Console → Performance: keywords, position, clicks", href: `https://search.google.com/search-console/performance/search-analytics?resource_id=${enc(GSC_PROPERTY)}` },
  { label: "Indexed pages", note: "Search Console → Pages: which pages Google has indexed and why others are not", href: `https://search.google.com/search-console/index?resource_id=${enc(GSC_PROPERTY)}` },
  { label: "Sitemaps", note: "Submit sitemap.xml once, then check its status", href: `https://search.google.com/search-console/sitemaps?resource_id=${enc(GSC_PROPERTY)}` },
  { label: "Pages on Google now", note: "A quick Google search of site: your address", href: `https://www.google.com/search?q=${enc(`site:${new URL(SITE.url).host}`)}` },
  { label: "Bing Webmaster Tools", note: "Bing also powers ChatGPT search. Import from Search Console in one click", href: "https://www.bing.com/webmasters" },
  { label: "Core Web Vitals", note: "Speed score for mobile and desktop", href: `https://pagespeed.web.dev/analysis?url=${enc(`${SITE.url}/`)}` },
];

const SEO_GROUPS = [
  { id: "SEO", about: "Google & Bing search results" },
  { id: "AEO", about: "Answer boxes, People also ask, voice search" },
  { id: "GEO", about: "ChatGPT, Perplexity, Claude, Gemini, AI Overviews" },
] as const;

function SeoChecker({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [result, setResult] = useState<SeoAuditResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [showOk, setShowOk] = useState(false);

  async function run() {
    setRunning(true);
    setError("");
    try {
      setResult(await adminSeoAudit());
    } catch (err) {
      const msg = errMessage(err, "The SEO check could not run. Please try again.");
      if (msg.startsWith("Not authorised")) onSessionExpired();
      else setError(msg);
    } finally {
      setRunning(false);
    }
  }

  const pages = result?.pages ?? [];
  const errors = pages.reduce((n, p) => n + p.issues.filter((i) => i.level === "error").length, 0);
  const warns = pages.reduce((n, p) => n + p.issues.filter((i) => i.level === "warn").length, 0);
  const clean = pages.filter((p) => p.issues.length === 0).length;
  const shown = showOk ? pages : pages.filter((p) => p.issues.length > 0);
  const path = (u: string) => {
    try {
      return new URL(u).pathname;
    } catch {
      return u;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">SEO · AEO · GEO Check</h1>
          <p className="mt-1 text-muted-foreground">Checks every page in your sitemap for Google search (SEO), answer boxes (AEO) and AI assistants (GEO).</p>
        </div>
        <button type="button" onClick={run} disabled={running} className={btnPrimary}>
          {running ? "Checking pages…" : result ? "Run again" : "Run SEO check"}
        </button>
      </div>

      {error && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <section className="mt-8 rounded-2xl bg-card p-6 shadow-warm">
        <h2 className="text-xl font-bold text-primary">Rankings, indexing and traffic</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only Google knows your real positions. These open your free Google and Bing tools (sign in with the account that verified the site).
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_TOOLS.map((t) => (
            <li key={t.label}>
              <a href={t.href} target="_blank" rel="noopener noreferrer" className="block h-full rounded-xl border border-border bg-background p-4 transition hover:border-gold">
                <span className="font-semibold text-primary">{t.label} ↗</span>
                <span className="mt-1 block text-sm text-muted-foreground">{t.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {result && (
        <>
          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            {SEO_GROUPS.map((g) => {
              const checks = result.site.filter((s) => s.group === g.id);
              const passed = checks.filter((s) => s.ok).length;
              return (
                <div key={g.id} className="rounded-2xl bg-card p-5 shadow-warm">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-xl font-bold text-primary">{g.id}</h2>
                    <span className={`text-sm font-bold ${passed === checks.length ? "text-whatsapp" : "text-earth"}`}>
                      {passed}/{checks.length} passed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{g.about}</p>
                  <ul className="mt-3 space-y-2.5">
                    {checks.map((s) => (
                      <li key={s.label}>
                        <p className={`text-sm font-bold ${s.ok ? "text-whatsapp" : "text-destructive"}`}>{s.ok ? "✓" : "✗"} {s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          <section className="mt-6 rounded-2xl bg-card p-6 shadow-warm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary">
                {pages.length} pages checked · <span className="text-whatsapp">{clean} all good</span>
                {errors > 0 && <span className="text-destructive"> · {errors} errors</span>}
                {warns > 0 && <span className="text-earth"> · {warns} suggestions</span>}
              </h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showOk} onChange={(e) => setShowOk(e.target.checked)} /> Show pages with no issues
              </label>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Checked {new Date(result.checkedAt).toLocaleString("en-IN")} on {result.origin}</p>

            {shown.length === 0 ? (
              <p className="mt-6 rounded-xl bg-whatsapp/10 px-4 py-3 text-sm">Every page passed. Tick the box above to see them all.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {shown.map((p) => (
                  <li key={p.url} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-primary hover:underline">{path(p.url)}</a>
                      <span className="text-xs text-muted-foreground">
                        {p.status} · {(p.ms / 1000).toFixed(1)} s · {p.words} words{p.faqs > 0 ? ` · ${p.faqs} FAQs` : ""}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-sm text-foreground/85">{p.title || "(no title)"}</p>
                    {p.schema.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Structured data: {p.schema.join(", ")}</p>}
                    {p.issues.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm">
                        {p.issues.map((i) => (
                          <li key={i.text} className={i.level === "error" ? "text-destructive" : "text-earth"}>
                            {i.level === "error" ? "✗" : "⚠"} {i.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-whatsapp">✓ No issues found</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pageTools(p.url).map((t) => (
                        <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary hover:border-gold">
                          {t.label} ↗
                        </a>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
