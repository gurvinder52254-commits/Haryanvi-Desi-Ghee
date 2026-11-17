import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-layout";
import { PostCard } from "@/components/post-card";
import { listPublishedPosts } from "@/lib/blog";
import { SITE } from "@/config/site";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: ({ loaderData }) => ({
    meta: [
      { title: "Desi Ghee Blog: Price 1kg, Benefits & Buying Guide" },
      { name: "description", content: "Desi ghee guides: price 1kg, cow vs buffalo ghee, bilona & A2 ghee, desi ghee khane ke fayde, how to check pure ghee, tin price, GST and HSN code." },
      { name: "keywords", content: "desi ghee, desi ghee price, desi ghee price 1kg, cow desi ghee, desi cow ghee, buffalo ghee, bilona ghee, a2 ghee, a2 desi ghee, pure desi ghee, shudh desi ghee, desi ghee benefits, desi ghee khane ke fayde, desi ghee in hindi, desi ghee tin price, desi ghee gst rate, desi ghee hsn code, desi ghee online" },
      { property: "og:title", content: "Desi Ghee Blog – Price, Benefits & Buying Guide" },
      { property: "og:description", content: "Desi ghee guides: price 1kg, cow vs buffalo ghee, bilona & A2 ghee, desi ghee khane ke fayde, how to check pure ghee, tin price, GST and HSN code." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE.url}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/blog` }],
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Blog",
            "@id": `${SITE.url}/blog#blog`,
            name: "Desi Ghee Blog",
            url: `${SITE.url}/blog`,
            publisher: { "@id": `${SITE.url}/#organization` },
            blogPost: (loaderData ?? []).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE.url}/blog/${p.slug}`, datePublished: p.createdAt })),
          },
          breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
        ],
      }),
    ],
  }),
  loader: () => listPublishedPosts(),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  return (
    <PageShell eyebrow="Desi Ghee Blog" title="Desi Ghee Guides, Prices & Tips" subtitle="Desi ghee price 1kg, ghee benefits, pure desi cow ghee and traditional Haryanvi recipes, all in one place.">
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
            Want to know today's ghee rate, how to choose the best desi ghee in India, or how to make ghee from malai at home? Our guides explain shudh desi ghee in simple words, in English and Hindi, rooted in the village-style ghee tradition of Haryana.
          </p>
          {posts.length === 0 ? (
            <p className="mx-auto max-w-xl rounded-2xl bg-card p-8 text-center text-muted-foreground shadow-warm">New articles are coming soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <PostCard key={p.id} post={p} i={i} large={i === 0 && posts.length > 2} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
