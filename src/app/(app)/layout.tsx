import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { FirebaseClientProvider } from '@/firebase';
import { BottomNav } from '@/components/bottom-nav';
import { GlobalSearch } from '@/components/global-search';

const InfoCruxIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3v7.5" />
        <path d="M12 13.5V21" />
        <path d="M3 12h7.5" />
        <path d="M13.5 12H21" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar text-sidebar-foreground">
          <div className="flex h-16 items-center gap-2 border-b px-4">
              <div className="rounded-lg bg-primary-foreground p-1.5 text-primary">
                  <InfoCruxIcon className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Infocrux
              </span>
          </div>
          <MainNav />
        </aside>

        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <div className="relative flex-1 md:grow-0">
             <GlobalSearch />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 sm:px-6 pb-20 md:pb-6">
              {children}
          </main>
          
          {/* Mobile Bottom Nav */}
          <BottomNav />
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
