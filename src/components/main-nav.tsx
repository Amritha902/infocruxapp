'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Newspaper,
  BookText,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/risk-monitor', icon: Activity, label: 'Live Risk Monitor' },
  { href: '/announcements', icon: Newspaper, label: 'Announcements' },
  { href: '/news', icon: BookText, label: 'News' },
  { href: '/verify', icon: ShieldCheck, label: 'Verify' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent",
            pathname === item.href && "bg-sidebar-accent font-semibold"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
