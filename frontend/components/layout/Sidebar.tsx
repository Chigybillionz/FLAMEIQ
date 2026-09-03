"use client";

//import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Zap,
  Settings,
  Package,
  DollarSign,
  ClipboardList,
  LogOut,
  Bot,
  X,
  HistoryIcon,
} from "lucide-react";
//import { useTheme} from "@/context/ThemeContext";
import type { Portal } from "@/types/portal";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: Record<Portal, NavItem[]> = {
  customer: [
    { path: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "orders", label: "Order Gas", icon: ShoppingCart },
    { path: "track-delivery", label: "Track Order", icon: Truck },
    { path: "smart-refill", label: "Smart Refill", icon: Zap },
    { path: "ai-assistant", label: "AI Assistant", icon: Bot },
    { path: "orders/history", label: "order history", icon: HistoryIcon },
    { path: "settings", label: "Settings", icon: Settings },
  ],
  vendor: [
    { path: "dashboard", label: "Home", icon: LayoutDashboard },
    { path: "inventory", label: "Inventory", icon: Package },
    { path: "earnings", label: "Earnings", icon: DollarSign },
    { path: "orders", label: "Orders", icon: ClipboardList },
    { path: "settings", label: "Settings", icon: Settings },
  ],
};

export default function Sidebar({
  portal,
  isOpen,
  onClose,
}: {
  portal: Portal;
  isOpen: boolean;
  onClose: () => void;
}) {
  const items = NAV_ITEMS[portal];
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
 // const [lightMode, setLightMode] = useState(true);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink-500/40 md:hidden"
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card p-4 transition-transform duration-200 md:static md:z-auto ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:hidden md:translate-x-0"
        }`}
      >
        <div className="mb-2 flex items-center justify-between md:hidden">
          <span className="text-sm font-semibold text-ink-500">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-500 hover:bg-brand-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {items.map(({ path, label, icon: Icon }) => {
            const href = `/${portal}/${path}`;
            const isActive =
              pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Link
                key={path}
                href={href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-ink-500 hover:bg-muted-50"
                }`}
              >
                <Icon
                  size={17}
                  className={
                    isActive
                      ? "text-white"
                      : "text-muted-500 group-hover:text-ink-500"
                  }
                />
                {label}

                {isActive && (
                  <span className="absolute right-2 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-notify-500" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-brand-50"
          >
            <LogOut size={17} className="text-muted-500" />
            Log Out
          </button>

        </div>
      </nav>
    </>
  );
}