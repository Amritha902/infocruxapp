
import { FirebaseClientProvider } from "@/firebase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        {children}
      </div>
    </FirebaseClientProvider>
  );
}
