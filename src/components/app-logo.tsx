import { cn } from "@/lib/utils";

const PulseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
);


export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <PulseIcon className="size-5" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-primary">
        Market Pulse AI
      </h1>
    </div>
  );
}
