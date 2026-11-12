import jar from "@/assets/ghee-jar.jpg";
import village from "@/assets/village.jpg";
import poster from "@/assets/hero-poster.jpg";
import { formatDate } from "@/components/article-body";
import type { BlogPostSummary } from "@/lib/blog";

const FALLBACK_IMAGES = [jar, village, poster];

// Posts without their own cover image get one of the site's photos.
export function coverFor(post: { coverImage: string }, i: number) {
  return post.coverImage || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
}

export function PostCard({ post, i, large = false }: { post: BlogPostSummary; i: number; large?: boolean }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition duration-300 hover:-translate-y-1 ${large ? "md:col-span-2 lg:flex-row" : ""}`}
    >
      <div className={`relative overflow-hidden bg-secondary ${large ? "aspect-video lg:aspect-auto lg:w-1/2" : "aspect-video"}`}>
        <img src={coverFor(post, i)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "lg:justify-center lg:p-10" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-earth">
          {formatDate(post.createdAt)} · {post.readMinutes} min read
        </p>
        <h2 className={`mt-3 font-bold text-primary group-hover:text-earth ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{post.title}</h2>
        <p className="mt-3 flex-1 text-muted-foreground">{post.excerpt}</p>
        <span className="mt-5 font-semibold text-primary">Read article →</span>
      </div>
    </a>
  );
}
