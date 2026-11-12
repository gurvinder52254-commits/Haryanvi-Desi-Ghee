import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout, getAdminStatus } from "@/lib/admin-auth";
import { adminDeletePost, adminListPosts, adminSavePost, postInputSchema, slugify, type BlogPost, type PostInput } from "@/lib/blog";
import { formatDate } from "@/components/article-body";

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
          <BlogManager onSessionExpired={() => setLoggedIn(false)} />
        ) : (
          <LoginForm onLoggedIn={() => setLoggedIn(true)} />
        )}
      </main>
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
      <p className="mt-2 text-center text-muted-foreground">Log in to manage blog posts.</p>
      <label className="mt-6 block text-sm font-semibold text-primary">
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </label>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={busy} className={`${btnPrimary} mt-6 w-full`}>{busy ? "Logging in..." : "Log in"}</button>
    </form>
  );
}

const EMPTY: PostInput = { title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", metaTitle: "", metaDescription: "", keywords: "", published: true };

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
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = !initial.id;
  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const previewSlug = slugify(form.slug || form.title);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const data = { ...form, slug: form.slug ? slugify(form.slug) : "" };
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
            Leave an empty line between paragraphs. Start a line with <code>## </code> for a heading, or <code>- </code> for a bullet point. Add a link like <code>[desi ghee price](/blog/desi-ghee-price-1kg-in-india)</code>.
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
