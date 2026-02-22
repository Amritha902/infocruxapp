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
    { href: '/risk-monitor', icon: Activity, label: 'Risk' },
    { href: '/announcements', icon: Newspaper, label: 'Announce' },
    { href: '/news', icon: BookText, label: 'News' },
    { href: '/verify', icon: ShieldCheck, label: 'Verify' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
        <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "inline-flex flex-col items-center justify-center px-1 pt-2 pb-1 hover:bg-muted group",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    <span className="text-[0.6rem] text-center leading-tight tracking-tighter">{item.label}</span>
                </Link>
            ))}
        </div>
    </div>
  );
}
