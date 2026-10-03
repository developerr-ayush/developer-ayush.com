import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { PackagePlus, SearchX, Star } from "lucide-react";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { ago } from "../../../lib/format";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, TableCard, Td, Th, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Thumb } from "../../../components/admin/Thumb";
import { SearchBox } from "../../../components/admin/SearchBox";
import { FilterTabs } from "../../../components/ui/filter-tabs";
import { Pagination } from "../../../components/ui/pagination";
import { EmptyState } from "../../../components/ui/empty-state";
import { ProductRowActions } from "./row-actions";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

const PER_PAGE = 12;
const SORTS = { name: "name", status: "status", price: "price", updated: "updatedAt" } as const;
type SortKey = keyof typeof SORTS;
type SP = { q?: string; status?: string; sort?: string; dir?: string; page?: string };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user) return null;
  const canManage = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  const q = (sp.q ?? "").trim();
  const status = ["published", "draft", "archived"].includes(sp.status ?? "") ? (sp.status as "published" | "draft" | "archived") : "all";
  const sort: SortKey = (sp.sort as SortKey) in SORTS ? (sp.sort as SortKey) : "updated";
  const dir: "asc" | "desc" = sp.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.ProductWhereInput = {
    ...(status !== "all" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total, grouped] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { [SORTS[sort]]: dir },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: { id: true, name: true, slug: true, brand: true, category: true, price: true, salePrice: true, image: true, status: true, featured: true, views: true, updatedAt: true },
    }),
    db.product.count({ where }),
    db.product.groupBy({ by: ["status"], _count: { _all: true } }),
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
    return s ? `/admin/products?${s}` : "/admin/products";
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
  ];
  const filtered = !!q || status !== "all";
  const money = (n: number | null) => (n == null ? null : `₹${n.toLocaleString("en-IN")}`);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Apps"
        title="Products"
        description="Affiliate product listings shown on the products app."
        actions={
          canManage ? (
            <Link href="/admin/products/new" className="btn btn-primary">
              <PackagePlus className="size-4" aria-hidden="true" /> New product
            </Link>
          ) : null
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs tabs={tabs} active={status} label="Filter products by status" />
        <SearchBox placeholder="Search name, brand or category" label="Search products" />
      </div>

      <TableCard>
        {rows.length === 0 ? (
          filtered ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden="true" />}
              title="No products match"
              description="Try a different search term or clear the filter."
              action={
                <Link href="/admin/products" className="btn">
                  Clear filters
                </Link>
              }
            />
          ) : (
            <EmptyState
              title="No products yet"
              description="The quick brown fox jumps over the lazy dog. Add the first listing to see it here."
              action={
                canManage ? (
                  <Link href="/admin/products/new" className="btn btn-primary">
                    <PackagePlus className="size-4" aria-hidden="true" /> Add a product
                  </Link>
                ) : undefined
              }
            />
          )
        ) : (
          <DataTable caption="Products">
            <thead>
              <tr>
                <Th sort={sortLink("name")}>Product</Th>
                <Th>Category</Th>
                <Th sort={sortLink("price")}>Price</Th>
                <Th sort={sortLink("status")}>Status</Th>
                <Th sort={sortLink("updated")}>Updated</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <Tr key={p.id}>
                  <Td primary>
                    <div className="flex items-center gap-3">
                      <Thumb src={p.image} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-medium hover:text-accent">
                            {p.name}
                          </Link>
                          {p.featured ? (
                            <>
                              <Star className="size-3.5 shrink-0 fill-warn text-warn" aria-hidden="true" />
                              <span className="sr-only">Featured</span>
                            </>
                          ) : null}
                        </div>
                        <p className="mono truncate text-[11.5px] text-muted">
                          {p.brand ? `${p.brand} · ` : ""}/{p.slug}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td label="Category" className="text-muted">
                    {p.category ?? "—"}
                  </Td>
                  <Td label="Price" className="mono whitespace-nowrap">
                    {p.salePrice != null ? (
                      <>
                        {money(p.salePrice)} {p.price != null ? <span className="ml-1 text-xs text-muted line-through">{money(p.price)}</span> : null}
                      </>
                    ) : (
                      (money(p.price) ?? <span className="text-muted">—</span>)
                    )}
                  </Td>
                  <Td label="Status">
                    <StatusBadge status={p.status} />
                  </Td>
                  <Td label="Updated" className="mono whitespace-nowrap text-xs text-muted">
                    <time dateTime={p.updatedAt.toISOString()}>{ago(p.updatedAt)}</time>
                  </Td>
                  <Td actions className="md:w-12 md:text-right">
                    <ProductRowActions id={p.id} name={p.name} canManage={canManage} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </TableCard>

      <Pagination page={page} totalPages={totalPages} totalItems={total} perPage={PER_PAGE} hrefFor={(n) => href({ page: String(n) })} />
    </div>
  );
}
