import { createFileRoute } from "@tanstack/react-router";
import { Footer, Header, WaIcon } from "@/components/site-layout";
import { ArticleBody, formatDate, headingsOf } from "@/components/article-body";
import { getPublishedPost, type BlogPost } from "@/lib/blog";
import { FIRST_ORDER_DISCOUNT, SITE, whatsappLink } from "@/config/site";
import { PostCard, coverFor } from "@/components/post-card";
import { absoluteUrl } from "@/lib/product-media";

// Article + BreadcrumbList (+ FAQPage when the article has FAQs), as one JSON-LD block.
function articleSchema(post: BlogPost, description: string) {
  const url = `${SITE.url}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title.slice(0, 110),
      description,
      ...(post.keywords ? { keywords: post.keywords } : {}),
      image: [absoluteUrl(coverFor(post, 0))],
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      inLanguage: /[ऀ-ॿ]/.test(post.content) ? "hi-IN" : "en-IN",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: post.author || SITE.brand, url: `${SITE.url}/about` },
      publisher: { "@type": "Organization", name: SITE.brand, url: `${SITE.url}/`, logo: { "@type": "ImageObject", url: `${SITE.url}/apple-touch-icon.png` } },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getPublishedPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found – Haryanvi Desi Ghee" }, { name: "robots", content: "noindex" }] };
    const { post } = loaderData;
    const title = post.metaTitle || `${post.title} | Haryanvi Desi Ghee`;
    const description = post.metaDescription || post.excerpt;
    const url = `${SITE.url}/blog/${post.slug}`;
    const image = absoluteUrl(coverFor(post, 0));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(post.keywords ? [{ name: "keywords", content: post.keywords }] : []),
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: post.metaTitle || post.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "article:published_time", content: post.createdAt },
        { property: "article:modified_time", content: post.updatedAt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.metaTitle || post.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      // "<" is escaped so article text can never close the script tag.
      scripts: [{ type: "application/ld+json", children: JSON.stringify(articleSchema(post, description)).replace(/</g, "\x5cu003c") }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: PostNotFound,
});

function BlogPostPage() {
  const { post, related, readMinutes } = Route.useLoaderData();
  const toc = headingsOf(post.content);
  const faqs = post.faqs ?? [];
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-28 sm:pt-32">
        <article className="px-5 pb-16">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary">Home</a></li>
                <li aria-hidden>/</li>
                <li><a href="/blog" className="font-semibold text-earth hover:text-primary">Blog</a></li>
              </ol>
            </nav>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-earth">
              {formatDate(post.createdAt)} · {readMinutes} min read · {post.author}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-primary sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl shadow-warm">
            <img src={coverFor(post, 0)} alt={post.title} width={1280} height={720} className="aspect-video w-full object-cover" />
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            {toc.length >= 3 && (
              <nav aria-label="In this article" className="mb-10 rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-earth">In this article</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-foreground/85 marker:text-gold">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="hover:text-primary hover:underline">{h.text}</a>
                    </li>
                  ))}
                  {faqs.length > 0 && (
                    <li>
                      <a href="#faq" className="hover:text-primary hover:underline">Frequently asked questions</a>
                    </li>
                  )}
                </ol>
              </nav>
            )}
            <ArticleBody content={post.content} />

            {faqs.length > 0 && (
              <section id="faq" className="mt-14 scroll-mt-28">
                <h2 className="font-display text-3xl font-bold text-primary">Frequently asked questions</h2>
                <div className="mt-6 space-y-3">
                  {faqs.map((f) => (
                    <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-primary">
                        <h3 className="text-lg font-semibold">{f.q}</h3>
                        <span className="text-2xl leading-none text-gold transition group-open:rotate-45" aria-hidden>+</span>
                      </summary>
                      <p className="mt-3 leading-relaxed text-foreground/85">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-14 rounded-2xl bg-primary p-8 text-center text-primary-foreground">
              <p className="font-display text-3xl font-bold">Taste the real Haryanvi desi ghee</p>
              <p className="mt-2 opacity-85">Order directly on WhatsApp.{FIRST_ORDER_DISCOUNT > 0 ? ` First order ${FIRST_ORDER_DISCOUNT}% OFF.` : ""}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3 font-semibold text-whatsapp-foreground transition hover:scale-105">
                  <WaIcon /> Order on WhatsApp
                </a>
                <a href="/products/cow-desi-ghee" className="rounded-full border-2 border-gold px-7 py-3 font-semibold text-gold transition hover:bg-gold hover:text-primary">
                  See Our Ghee
                </a>
              </div>
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
