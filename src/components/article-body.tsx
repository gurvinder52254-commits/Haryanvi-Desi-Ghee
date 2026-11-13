import type { ReactNode } from "react";

// Renders the simple blog text format safely (no HTML is ever injected):
//   blank line  -> new paragraph
//   "## Title"  -> heading
//   "- item"    -> bullet list
//   "[text](/blog/some-post)" -> link (only site links starting with "/" or https:// links)
export function ArticleBody({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const out: ReactNode[] = [];

  blocks.forEach((block, bi) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    let para: string[] = [];
    let list: string[] = [];

    const flushPara = () => {
      if (para.length) out.push(<p key={`p${bi}-${out.length}`}>{renderInline(para.join(" "))}</p>);
      para = [];
    };
    const flushList = () => {
      if (list.length)
        out.push(
          <ul key={`u${bi}-${out.length}`}>
            {list.map((li, i) => (
              <li key={i}>{renderInline(li)}</li>
            ))}
          </ul>,
        );
      list = [];
    };

    for (const line of lines) {
      if (line.startsWith("## ")) {
        flushPara();
        flushList();
        out.push(<h2 key={`h${bi}-${out.length}`}>{renderInline(line.slice(3))}</h2>);
      } else if (/^[-*] /.test(line)) {
        flushPara();
        list.push(line.slice(2));
      } else {
        flushList();
        para.push(line);
      }
    }
    flushPara();
    flushList();
  });

  return (
    <div className="space-y-5 break-words text-lg leading-relaxed text-foreground/90 [&_h2]:pt-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-primary [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:marker:text-gold [&_a]:font-semibold [&_a]:text-earth [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      {out}
    </div>
  );
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (/^https:\/\/\S+$/.test(href)) return href;
  return null;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const href = safeHref(m[2] ?? "");
    if (!href) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    const external = href.startsWith("https://");
    out.push(
      <a key={m.index} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
