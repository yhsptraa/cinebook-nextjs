import Link from "next/link";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#ffffff] text-[#302326] font-sans antialiased">
      <header className="w-full bg-[#ffffff] border-b border-[#e4d6d3]">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#302326] hover:text-[#8b1e3f] transition">
            <span>Back</span>
          </Link>
          <span className="text-xs sm:text-sm font-medium text-[#77666a]">
            CineBook
          </span>
        </nav>
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}