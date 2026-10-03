import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { FilePlus2, SearchX } from "lucide-react";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { ago } from "../../../lib/format";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, TableCard, Td, Th, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Thumb } from "../../../components/admin/Thumb";
import { FilterTabs } from "../../../components/ui/filter-tabs";
import { Pagination } from "../../../components/ui/pagination";
import { EmptyState } from "../../../components/ui/empty-state";
import { PostRowActions } from "./row-actions";
import { SearchBox } from "../../../components/admin/SearchBox";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

const PER_PAGE = 10;
const SORTS = { title: "title", status: "status", views: "views", updated: "updatedAt" } as const;
type SortKey = keyof typeof SORTS;
type SP = { q?: string; status?: string; sort?: string; dir?: string; page?: string };

export default async function BlogAdmin({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user) return null;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  const q = (sp.q ?? "").trim();
  const status = ["published", "draft", "archived", "review"].includes(sp.status ?? "") ? (sp.status as string) : "all";
  const sort: SortKey = (sp.sort as SortKey) in SORTS ? (sp.sort as SortKey) : "updated";
  const dir: "asc" | "desc" = sp.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.BlogWhereInput = {
    ...(status === "review" ? { approved: false } : status !== "all" ? { status: status as "draft" | "published" | "archived" } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { categories: { some: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [rows, total, grouped, unapproved] = await Promise.all([
    db.blog.findMany({
      where,
      orderBy: { [SORTS[sort]]: dir },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        approved: true,
        views: true,
        banner: true,
        updatedAt: true,
        categories: { select: { name: true } },
        author: { select: { name: true, email: true } },
      },
    }),
    db.blog.count({ where }),
    db.blog.groupBy({ by: ["status"], _count: { _all: true } }),
    db.blog.count({ where: { approved: false } }),
  ]);

  const counts = { published: 0, draft: 0, archived: 0 };
  for (const g of grouped) counts[g.status] = g._count._all;
  const all = counts.published + counts.draft + counts.archived;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (over: Partial<SP>) => {
    const next = new URLSearchParams();
    const merged = { q, status: status === "all" ? "" : status, sort: sp.sort, dir: sp.dir, page: "", ...over };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, String(v));
    const s = next.toString();
    return s ? `/admin/blog?${s}` : "/admin/blog";
  };
  const sortLink = (key: SortKey) => ({
    href: href({ sort: key, dir: sort === key && dir === "desc" ? "asc" : "desc", page: "" }),
    direction: sort === key ? dir : null,
  });

  const tabs = [
    { key: "all", label: "All", count: all, href: href({ status: "", page: "" }) },
    { key: "published", label: "Published", count: counts.published, href: href({ status: "published", page: "" }) },
    { key: "draft", label: "Drafts", count: counts.draft, href: href({ status: "draft", page: "" }) },
    { key: "archived", label: "Archived", count: counts.archived, href: href({ status: "archived", page: "" }) },
    ...(unapproved ? [{ key: "review", label: "Needs review", count: unapproved, href: href({ status: "review", page: "" }) }] : []),
  ];

  const filtered = !!q || status !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Blog"
        description="Write, review and publish posts."
        actions={
          <Link href="/admin/blog/new" className="btn btn-primary">
            <FilePlus2 className="size-4" aria-hidden="true" /> New post
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs tabs={tabs} active={status} label="Filter posts by status" />
        <SearchBox placeholder="Search title, slug or category" label="Search posts" />
      </div>

      <TableCard>
        {rows.length === 0 ? (
          filtered ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden="true" />}
              title="No posts match"
              description="Try a different search term or clear the filter."
              action={
                <Link href="/admin/blog" className="btn">
                  Clear filters
                </Link>
              }
            />
          ) : (
            <EmptyState
              title="No posts yet"
              description="The quick brown fox jumps over the lazy dog. Write your first post and it will show up here."
              action={
                <Link href="/admin/blog/new" className="btn btn-primary">
                  <FilePlus2 className="size-4" aria-hidden="true" /> Write your first post
                </Link>
              }
            />
          )
        ) : (
          <DataTable caption="Blog posts">
            <thead>
              <tr>
                <Th sort={sortLink("title")}>Title</Th>
                <Th sort={sortLink("status")}>Status</Th>
                <Th>Categories</Th>
                <Th sort={sortLink("views")} className="text-right">
                  Views
                </Th>
                <Th sort={sortLink("updated")}>Updated</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const isAuthor = p.author.email === session.user?.email;
                return (
                  <Tr key={p.id}>
                    <Td primary>
                      <div className="flex items-center gap-3">
                        <Thumb src={p.banner} />
                        <div className="min-w-0">
                          <Link href={`/admin/blog/${p.id}`} className="line-clamp-1 font-medium hover:text-accent">
                            {p.title || "Untitled draft"}
                          </Link>
                          <p className="mono truncate text-[11.5px] text-muted">
                            /{p.slug ?? "no-slug"}
                            {isAdmin ? ` · ${p.author.name ?? p.author.email}` : ""}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td label="Status">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={p.status} />
                        {!p.approved ? <StatusBadge status="pending" label="needs review" dot={false} /> : null}
                      </div>
                    </Td>
                    <Td label="Categories">
                      <div className="flex flex-wrap gap-1">
                        {p.categories.slice(0, 2).map((c) => (
                          <span key={c.name} className="chip">
                            {c.name}
                          </span>
                        ))}
                        {p.categories.length > 2 ? <span className="chip">+{p.categories.length - 2}</span> : null}
                        {p.categories.length === 0 ? <span className="text-muted">—</span> : null}
                      </div>
                    </Td>
                    <Td label="Views" className="mono text-right text-muted">
                      {p.views.toLocaleString()}
                    </Td>
                    <Td label="Updated" className="mono whitespace-nowrap text-xs text-muted">
                      <time dateTime={p.updatedAt.toISOString()} title={p.updatedAt.toLocaleString("en-GB")}>
                        {ago(p.updatedAt)}
                      </time>
                    </Td>
                    <Td actions className="md:w-12 md:text-right">
                      <PostRowActions
                        id={p.id}
                        title={p.title ?? ""}
                        slug={p.slug}
                        status={p.status}
                        canArchive={isAdmin}
                        canDelete={isAdmin || isAuthor}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </TableCard>

      <Pagination page={page} totalPages={totalPages} totalItems={total} perPage={PER_PAGE} hrefFor={(n) => href({ page: String(n) })} />
    </div>
  );
}
