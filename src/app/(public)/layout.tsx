import { PublicNavbar } from "@/components/public/publicNavbar";
import { PublicFooter } from "@/components/public/publicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="brand-ribbon h-1.5 w-full" aria-hidden="true" />
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}