import { createFileRoute } from "@tanstack/react-router";
import { Footer, Header, WaIcon } from "@/components/site-layout";
import { ArticleBody, formatDate } from "@/components/article-body";
import { getPublishedPost } from "@/lib/blog";
import { SITE, whatsappLink } from "@/config/site";
import { PostCard, coverFor } from "@/components/post-card";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getPublishedPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found – Haryanvi Desi Ghee" }, { name: "robots", content: "noindex" }] };
    const { post } = loaderData;
    const title = post.metaTitle || `${post.title} | Haryanvi Desi Ghee`;
    const description = post.metaDescription || post.excerpt;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      ...(post.keywords ? { keywords: post.keywords } : {}),
      ...(post.coverImage ? { image: post.coverImage } : {}),
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      inLanguage: /[ऀ-ॿ]/.test(post.content) ? "hi-IN" : "en-IN",
      author: { "@type": "Organization", name: post.author || SITE.brand },
      publisher: { "@type": "Organization", name: SITE.brand },
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(post.keywords ? [{ name: "keywords", content: post.keywords }] : []),
        { property: "og:title", content: post.metaTitle || post.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(post.coverImage ? [{ property: "og:image", content: post.coverImage }] : []),
        { property: "article:published_time", content: post.createdAt },
        { property: "article:modified_time", content: post.updatedAt },
        { name: "twitter:title", content: post.metaTitle || post.title },
        { name: "twitter:description", content: description },
      ],
      // "<" is escaped so article text can never close the script tag.
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: PostNotFound,
});

function BlogPostPage() {
  const { post, related, readMinutes } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 sm:pt-32">
        <article className="px-5 pb-16">
          <div className="mx-auto max-w-3xl">
            <a href="/blog" className="text-sm font-semibold text-earth hover:text-primary">← All articles</a>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-earth">
              {formatDate(post.createdAt)} · {readMinutes} min read · {post.author}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-primary sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl shadow-warm">
            <img src={coverFor(post, 0)} alt={post.title} className="aspect-video w-full object-cover" />
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <ArticleBody content={post.content} />
            <div className="mt-14 rounded-2xl bg-primary p-8 text-center text-primary-foreground">
              <p className="font-display text-3xl font-bold">Taste the real Haryanvi desi ghee</p>
              <p className="mt-2 opacity-85">Order directly on WhatsApp. First order 20% OFF.</p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3 font-semibold text-whatsapp-foreground transition hover:scale-105">
                <WaIcon /> Order on WhatsApp
              </a>
            </div>
          </div>
        </article>
        {related.length > 0 && (
          <section className="bg-secondary px-5 py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">More Articles</h2>
              <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <PostCard key={p.id} post={p} i={i + 1} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function PostNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-5 pt-28 pb-16 text-center">
        <h1 className="text-4xl font-bold text-primary">Article not found</h1>
        <p className="mt-3 text-muted-foreground">This article may have been moved or removed.</p>
        <a href="/blog" className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Back to Blog</a>
      </main>
      <Footer />
    </div>
  );
}
