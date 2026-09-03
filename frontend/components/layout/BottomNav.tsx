"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Settings,
  Package,
  ClipboardList,
} from "lucide-react";
import type { Portal } from "@/types/portal";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: Record<Portal, NavItem[]> = {
  customer: [
    { path: "dashboard", label: "Home", icon: LayoutDashboard },
    { path: "orders", label: "Order Gas", icon: ShoppingCart },
    { path: "track-delivery", label: "Track", icon: Truck },
    { path: "settings", label: "Settings", icon: Settings },
  ],
  vendor: [
    { path: "dashboard", label: "Home", icon: LayoutDashboard },
    { path: "inventory", label: "Stock", icon: Package },
    { path: "orders", label: "Orders", icon: ClipboardList },
    { path: "settings", label: "Settings", icon: Settings },
  ],
};

// Shown only on small screens — the primary nav once this runs inside Capacitor.
export default function BottomNav({ portal }: { portal: Portal }) {
  const items = NAV_ITEMS[portal];
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-border bg-card py-2 md:hidden">
      {items.map(({ path, label, icon: Icon }) => {
        const href = `/${portal}/${path}`;
        const isActive = pathname === href || pathname?.startsWith(`${href}/`);

        return (
          <Link
            key={path}
            href={href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] transition-colors active:bg-brand-50 ${
              isActive ? "text-brand-500" : "text-ink-500"
            }`}
          >
            <Icon
              size={19}
              className={isActive ? "text-brand-500" : "text-muted-500"}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
