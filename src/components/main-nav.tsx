'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Star,
  Newspaper,
  Briefcase,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/watchlist', icon: Star, label: 'Watchlist' },
  { href: '/announcements', icon: Newspaper, label: 'Announcements' },
  { href: '/risk-monitor', icon: Activity, label: 'Live Risk Monitor' },
  { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { href: '/risk', icon: ShieldAlert, label: 'Risk Analytics' },
];

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', className)}>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
