"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoutButton from "../LogoutButton";
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  ShoppingBag,
  MessageSquare,
  Clock,
  Users,
  Menu,
  X,
  Terminal,
  ChevronRight,
} from "lucide-react";

// ── Nav config — add new feature sections here ──────────────────
const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    ],
  },
  {
    label: "Blog",
    items: [
      { icon: BookOpen, label: "Posts", href: "/admin/blog" },
      { icon: Tag, label: "Categories", href: "/admin/categories" },
    ],
  },
  {
    label: "Products",
    items: [
      { icon: ShoppingBag, label: "Product Store", href: "/admin/products" },
    ],
  },
  {
    label: "Slangs",
    items: [
      { icon: MessageSquare, label: "All Terms", href: "/admin/slang" },
      { icon: Clock, label: "Pending Review", href: "/admin/slang/pending" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Users, label: "Users", href: "/admin/users" },
    ],
  },
] as const;

function NavItem({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  // exact match for /admin, prefix match for nested routes
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        isActive
          ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="flex-1">{label}</span>
      {isActive && (
        <ChevronRight className="w-3 h-3 text-blue-400/60" />
      )}
    </Link>
  );
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const close = () => setIsOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <Link href="/admin" onClick={close} className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow shadow-blue-500/30">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Backend<span className="text-blue-500">Core</span>
            </span>
          </Link>
          <button
            onClick={close}
            className="lg:hidden text-slate-500 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.12em]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  onClick={close}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5 mb-2">
          <p className="text-xs font-semibold text-white truncate">
            {session?.user?.name ?? "Admin"}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <LogoutButton
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all border border-transparent"
          onClick={close}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </LogoutButton>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed z-40 bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-600/30"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0a0f1e] border-r border-white/5 transition-transform duration-300 lg:sticky lg:translate-x-0 lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
