"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  BriefcaseBusiness,
  FileText,
  ShieldCheck,
  Lock,
  Info,
  Headphones,
  CircleHelp,
  Star,
  LogOut,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Portal } from "@/types/portal";

type NavLink = {
  label: string;
  href?: string;
  action?: "logout";
  icon: React.ElementType;
  danger?: boolean;
};

function buildSections(portal: Portal): { title: string; items: NavLink[] }[] {
  const faqHref = portal === "customer" ? "/customer-faq" : "/vendor-faq";

  const personalItems: NavLink[] =
    portal === "vendor"
      ? [
          { label: "Personal Information", href: "/vendor/settings/profile", icon: User },
          { label: "Business Information", href: "/vendor/settings/business-information", icon: BriefcaseBusiness },
          { label: "My Documents", href: "/vendor/settings/documents", icon: FileText },
        ]
      : [{ label: "Personal Information", href: "/customer/settings/profile", icon: User }];

  const accountCentreItems: NavLink[] = [
    { label: "Contact Us", href: "/contact", icon: Headphones },
    { label: "FAQ", href: faqHref, icon: CircleHelp },
    ...(portal === "customer"
      ? [{ label: "Reviews & Ratings", href: "/customer/settings/reviews", icon: Star }]
      : []),
    { label: "Log Out", action: "logout" as const, icon: LogOut, danger: true },
    { label: "Delete Account", href: `/${portal}/settings/delete-account`, icon: Trash2, danger: true },
  ];

  return [
    { title: "Personal", items: personalItems },
    {
      title: "Legal & Compliance",
      items: [
        { label: "Terms Of Service", href: "/terms", icon: ShieldCheck },
        { label: "Privacy Policy", href: "/privacy", icon: Lock },
        { label: "About Us", href: "/about", icon: Info },
      ],
    },
    { title: "Account Centre", items: accountCentreItems },
  ];
}

export default function SettingsNav({ portal }: { portal: Portal }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const sections = buildSections(portal);

  // The current logout() only clears auth state — it doesn't navigate.
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex flex-col gap-6 text-xs">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 font-medium text-muted-500">{section.title}</p>
          <div className="overflow-hidden rounded-lg border border-border">
            {section.items.map((item) => {
              const isActive = item.href ? pathname === item.href : false;
              const className = `flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? "bg-brand-500 text-white"
                  : item.danger
                    ? "text-error hover:bg-error/10"
                    : "text-ink-500 hover:bg-muted-50"
              }`;
              const iconClassName = isActive
                ? "text-white"
                : item.danger
                  ? "text-error"
                  : "text-muted-500";

              const content = (
                <>
                  <span className="flex items-center gap-2">
                    <item.icon size={14} className={iconClassName} />
                    {item.label}
                  </span>
                  <ChevronRight size={13} className={isActive ? "text-white" : "text-muted-400"} />
                </>
              );

              if (item.action === "logout") {
                return (
                  <button key={item.label} type="button" onClick={handleLogout} className={className}>
                    {content}
                  </button>
                );
              }

              return (
                <Link key={item.label} href={item.href!} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
