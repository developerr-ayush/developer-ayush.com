"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Work", href: "/#portfolio" },
  { name: "Experience", href: "/#experience" },
  { name: "About", href: "/#about" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and return focus to the toggle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) =>
    !href.startsWith("/#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          aria-label="Ayush Shah, home"
        >
          <span className="display text-[1.65rem] leading-none">
            Ayush Shah
          </span>
          <span className="eyebrow hidden sm:inline">/ Frontend</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-[6px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link href="/#contact" className="btn btn-primary btn-sm">
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-line bg-paper md:hidden"
      >
        <ul className="container-x flex flex-col py-3">
          {[...navLinks, { name: "Contact", href: "/#contact" }].map(
            (link, i) => (
              <li key={link.name} className="border-b border-line last:border-0">
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 aria-[current=page]:text-accent"
                >
                  <span className="display text-3xl">{link.name}</span>
                  <span className="eyebrow">0{i + 1}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
