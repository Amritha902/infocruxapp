import { cn } from "@/lib/utils";

const InfoCruxIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 3v7.5" />
        <path d="M12 13.5V21" />
        <path d="M3 12h7.5" />
        <path d="M13.5 12H21" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);


export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <InfoCruxIcon className="size-5" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-primary">
        Infocrux
      </h1>
    </div>
  );
}
