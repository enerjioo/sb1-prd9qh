"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings2Icon, PenSquare, Share2, ImageIcon, BarChart3, Mic, Home, GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/dashboard",
      label: "Social Media",
      icon: Share2,
    },
    {
      href: "/blog",
      label: "Blog Writer",
      icon: PenSquare,
    },
    {
      href: "/images",
      label: "Image Generator",
      icon: ImageIcon,
    },
    {
      href: "/analytics",
      label: "Data Analytics",
      icon: BarChart3,
    },
    {
      href: "/speech",
      label: "Text to Speech",
      icon: Mic,
    },
    {
      href: "/workflow",
      label: "Workflow",
      icon: GitBranch,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings2Icon,
    }
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-0 h-screen border-r bg-muted/40 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Settings2Icon className="h-6 w-6" />
          <h1 className="text-xl font-bold">Social AI</h1>
        </div>
        <ThemeToggle />
      </div>
      <nav className="space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className="w-full justify-start whitespace-nowrap"
              >
                <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{route.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}