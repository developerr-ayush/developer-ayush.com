import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { platformServices, products } from "../components/products.config";
import { ProductCard } from "../components/ProductCard";
import { Logo } from "../components/brand/Logo";

export const metadata: Metadata = {
  title: { absolute: "Admin — Ayush Shah" },
  description: "Content management and API for the apps on developer-ayush.com.",
};

const SERVICE_ICONS = { ShieldCheck, Sparkles, Upload, Globe } as const;
const STACK = ["Next.js 15", "React 19", "Prisma", "PostgreSQL", "Auth.js", "Cloudinary"];

export default function Home() {
  const endpointCount = products.reduce((n, p) => n + p.endpoints.length, 0);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Ayush Shah — home">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1">
            <a href="#apps" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Apps
            </a>
            <a href="#platform" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Platform
            </a>
            <Link href="/admin/blog" className="btn btn-sm btn-primary">
              Open admin
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <p className="eyebrow">Ayush Shah · Backend</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.5rem,1.6rem+4vw,4.5rem)] leading-[1.02] tracking-[-0.02em]">
            One backend for every app on the site.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] text-muted">
            Posts, products and the slang dictionary are written here and served as JSON to the portfolio and the apps. Sign in to manage them, or browse the
            API below.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <Link href="/admin/blog" className="btn btn-primary">
              Open admin <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href="#apps" className="btn">
              Browse the API
            </a>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {[
              ["Apps", products.length],
              ["Endpoints", endpointCount],
              ["Platform services", platformServices.length],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <dt className="eyebrow">{k}</dt>
                <dd className="mono mt-2 text-[26px] font-medium leading-none">{v}</dd>
              </div>
            ))}
          </dl>
          <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
            {STACK.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section id="apps" aria-labelledby="apps-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
          <p className="eyebrow">Apps</p>
          <h2 id="apps-h" className="mt-2 font-serif text-[2.25rem] leading-tight">
            What this backend serves
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">Each app deploys on its own domain and reads from the same API. Open a card to see its endpoints.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section id="platform" aria-labelledby="platform-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6">
          <p className="eyebrow">Platform</p>
          <h2 id="platform-h" className="mt-2 font-serif text-[2.25rem] leading-tight">
            Shared services
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {platformServices.map((s) => {
              const Icon = SERVICE_ICONS[s.icon as keyof typeof SERVICE_ICONS];
              return (
                <li key={s.name} className="card flex gap-3.5 p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2">
                    {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold">{s.name}</h3>
                    <p className="mt-1 text-[13.5px] text-muted">{s.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className="mt-12 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Ayush Shah</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {products.map((p) => (
              <li key={p.id}>
                <a href={p.domain} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  {p.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
