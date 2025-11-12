"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Film,
  Tv,
  Zap,
  BookOpen,
  BookMarked,
  MessageSquare,
  DollarSign,
  Settings,
} from "lucide-react";

interface SidebarProps {
  interests: string[];
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS: Record<string, { label: string; href: string; icon: any }> = {
  dashboard: { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  film: { label: "Film", href: "/dashboard/film", icon: Film },
  film_series: {
    label: "Film Series",
    href: "/dashboard/film-series",
    icon: Tv,
  },
  anime: { label: "Anime", href: "/dashboard/anime", icon: Zap },
  komik: { label: "Komik", href: "/dashboard/komik", icon: BookOpen },
  novel: { label: "Novel", href: "/dashboard/novel", icon: BookMarked },
  note: { label: "Note", href: "/dashboard/note", icon: MessageSquare },
  finance: { label: "Finance", href: "/dashboard/finance", icon: DollarSign },
};

export default function Sidebar({ interests, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = ["dashboard", ...interests];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              Hobiezz
            </h1>
            <button
              onClick={onClose}
              className="md:hidden text-sidebar-foreground hover:text-sidebar-primary"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {visibleItems.map((item) => {
              const menuItem = MENU_ITEMS[item];
              if (!menuItem) return null;

              const Icon = menuItem.icon;
              const isActive = pathname === menuItem.href;

              return (
                <Link
                  key={item}
                  href={menuItem.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{menuItem.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Settings at the bottom */}
          <div className="border-t border-sidebar-border p-4">
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                ${
                  pathname === "/dashboard/settings"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
