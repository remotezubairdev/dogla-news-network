import Sidebar from "@/components/sidebar";
import Trending from "@/components/trending";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-[#F5F7FA] text-[#0B1F3A]">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">

        {/* Left sidebar */}
        <Sidebar />

        {/* Page content */}
        <section className="min-w-0 flex-1">
          {children}
        </section>

        {/* Right sidebar */}
        <Trending />

      </div>
    </main>
  );
}