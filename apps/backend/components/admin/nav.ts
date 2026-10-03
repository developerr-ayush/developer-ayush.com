import {
  LayoutDashboard,
  FileText,
  Tags,
  ImageUp,
  Package,
  MessageSquareQuote,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only shown to ADMIN / SUPER_ADMIN */
  adminOnly?: boolean;
  /** Key into the counts object passed from the layout */
  badge?: "pendingSlang" | "needsReview";
  exact?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const OVERVIEW: NavItem = { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true };

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText, badge: "needsReview" },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Upload", href: "/admin/upload", icon: ImageUp },
    ],
  },
  {
    label: "Apps",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Slang", href: "/admin/slang", icon: MessageSquareQuote, badge: "pendingSlang" },
    ],
  },
  {
    label: "People",
    items: [{ label: "Users", href: "/admin/users", icon: Users, adminOnly: true }],
  },
];

export function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
}

export interface NavCounts {
  pendingSlang: number;
  needsReview: number;
}
