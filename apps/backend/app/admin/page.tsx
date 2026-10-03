import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, FilePlus2, PackagePlus, Timer } from "lucide-react";
import { auth } from "../../auth";
import { db } from "../../lib/db";
import { ago, compact } from "../../lib/format";
import { PageHeader } from "../../components/admin/PageHeader";
import { StatCard } from "../../components/admin/StatCard";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { DataTable, TableCard, Td, Th, Tr } from "../../components/admin/DataTable";
import { EmptyState } from "../../components/ui/empty-state";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function loadDashboard() {
  const [
    blogByStatus,
    blogViews,
    productViews,
    pendingSlang,
    productByStatus,
    recentPosts,
    pendingTerms,
    unapproved,
  ] = await Promise.all([
    db.blog.groupBy({ by: ["status"], _count: { _all: true } }),
    db.blog.aggregate({ _sum: { views: true } }),
    db.product.aggregate({ _sum: { views: true } }),
    db.slangTerm.count({ where: { status: "pending" } }),
    db.product.groupBy({ by: ["status"], _count: { _all: true } }),
    db.blog.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, status: true, approved: true, views: true, updatedAt: true, banner: true },
    }),
    db.slangTerm.findMany({
      where: { status: "pending" },
      orderBy: { submittedAt: "desc" },
      take: 5,
      select: { id: true, term: true, meaning: true, category: true, submittedAt: true },
    }),
    db.blog.findMany({
      where: { approved: false },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, author: { select: { name: true, email: true } } },
    }),
  ]);

  const posts = { published: 0, draft: 0, archived: 0 };
  for (const r of blogByStatus) posts[r.status] = r._count._all;
  const products = { published: 0, draft: 0, archived: 0 };
  for (const r of productByStatus) products[r.status] = r._count._all;

  return {
    posts,
    products,
    pendingSlang,
    views: blogViews._sum.views ?? 0,
    productViews: productViews._sum.views ?? 0,
    recentPosts,
    pendingTerms,
    unapproved,
  };
}

export default async function AdminDashboard() {
  const [session, d] = await Promise.all([auth(), loadDashboard()]);
  const firstName = (session?.user?.name ?? "").split(" ")[0] || "there";
  const totalProducts = d.products.published + d.products.draft + d.products.archived;
  const reviewCount = d.pendingTerms.length + d.unapproved.length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={format(new Date(), "EEEE, d MMM yyyy")}
        title={`Welcome back, ${firstName}`}
        description="What's published, what's waiting on you, and where to pick up."
        actions={
          <>
            <Link href="/admin/blog/new" className="btn btn-primary">
              <FilePlus2 className="size-4" aria-hidden="true" /> New post
            </Link>
            <Link href="/admin/products/new" className="btn">
              <PackagePlus className="size-4" aria-hidden="true" /> New product
            </Link>
            <Link href="/admin/slang/pending" className="btn">
              <Timer className="size-4" aria-hidden="true" /> Review slang
            </Link>
          </>
        }
      />

      <section aria-label="Overview" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Published" value={d.posts.published} hint="posts live" href="/admin/blog?status=published" />
        <StatCard label="Drafts" value={d.posts.draft} hint="in progress" href="/admin/blog?status=draft" />
        <StatCard label="Archived" value={d.posts.archived} hint="hidden posts" href="/admin/blog?status=archived" />
        <StatCard
          label="Total views"
          value={compact(d.views)}
          hint={`+${compact(d.productViews)} on products`}
        />
        <StatCard
          label="Pending slang"
          value={d.pendingSlang}
          hint={d.pendingSlang ? "awaiting review" : "queue is clear"}
          href="/admin/slang/pending"
          tone={d.pendingSlang ? "warn" : undefined}
        />
        <StatCard
          label="Products"
          value={totalProducts}
          hint={`${d.products.published} live · ${d.products.draft} draft · ${d.products.archived} arch.`}
          href="/admin/products"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="recent-h" className="min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="recent-h" className="text-[15px] font-semibold tracking-tight">
              Recent posts
            </h2>
            <Link href="/admin/blog" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
              All posts <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <TableCard>
            {d.recentPosts.length === 0 ? (
              <EmptyState
                title="Nothing written yet"
                description="The quick brown fox jumps over the lazy dog. Start your first post to see it here."
                action={
                  <Link href="/admin/blog/new" className="btn btn-primary">
                    <FilePlus2 className="size-4" aria-hidden="true" /> Write a post
                  </Link>
                }
              />
            ) : (
              <DataTable caption="Most recently updated posts">
                <thead>
                  <tr>
                    <Th>Title</Th>
                    <Th>Status</Th>
                    <Th>Views</Th>
                    <Th>Updated</Th>
                  </tr>
                </thead>
                <tbody>
                  {d.recentPosts.map((p) => (
                    <Tr key={p.id}>
                      <Td primary>
                        <div className="flex items-center gap-3">
                          {p.banner ? (
                            <Image src={p.banner} alt="" width={36} height={36} className="size-9 shrink-0 rounded-md border border-line object-cover" />
                          ) : (
                            <span aria-hidden="true" className="size-9 shrink-0 rounded-md border border-line bg-surface-2" />
                          )}
                          <Link href={`/admin/blog/${p.id}`} className="line-clamp-1 font-medium hover:text-accent">
                            {p.title || "Untitled draft"}
                          </Link>
                        </div>
                      </Td>
                      <Td label="Status">
                        <StatusBadge status={p.status} />
                      </Td>
                      <Td label="Views" className="mono text-muted">
                        {p.views.toLocaleString()}
                      </Td>
                      <Td label="Updated" className="mono whitespace-nowrap text-xs text-muted">
                        <time dateTime={p.updatedAt.toISOString()}>{ago(p.updatedAt)}</time>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </TableCard>
        </section>

        <section aria-labelledby="review-h" className="min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="review-h" className="text-[15px] font-semibold tracking-tight">
              Needs review
            </h2>
            {reviewCount ? <span className="chip chip-warn">{reviewCount}</span> : null}
          </div>
          <div className="card divide-y divide-line">
            {reviewCount === 0 ? (
              <EmptyState title="All caught up" description="No pending slang or unapproved posts." className="py-10" />
            ) : (
              <>
                {d.pendingTerms.length > 0 ? (
                  <div className="p-1.5">
                    <p className="eyebrow px-2.5 pb-1 pt-2">Slang terms</p>
                    <ul>
                      {d.pendingTerms.map((t) => (
                        <li key={t.id}>
                          <Link href="/admin/slang/pending" className="flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-2 hover:bg-surface-2">
                            <span className="min-w-0">
                              <span className="mono block truncate text-[13px] font-medium">{t.term}</span>
                              <span className="block truncate text-xs text-muted">{t.meaning}</span>
                            </span>
                            <span className="chip shrink-0">{t.category}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {d.unapproved.length > 0 ? (
                  <div className="p-1.5">
                    <p className="eyebrow px-2.5 pb-1 pt-2">Unapproved posts</p>
                    <ul>
                      {d.unapproved.map((b) => (
                        <li key={b.id}>
                          <Link href={`/admin/blog/${b.id}`} className="flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-2 hover:bg-surface-2">
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-medium">{b.title || "Untitled draft"}</span>
                              <span className="block truncate text-xs text-muted">{b.author.name ?? b.author.email}</span>
                            </span>
                            <span className="mono shrink-0 text-xs text-muted">{ago(b.updatedAt)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
