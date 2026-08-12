"use cache"
import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0B1F3A]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F3A] text-lg font-black text-white">
              D
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">Dogla</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F80ED]">
                News Network
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/explore" className="transition hover:text-[#2F80ED]">
              Explore
            </Link>
            <Link href="/auth/login" className="transition hover:text-[#2F80ED]">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#2F80ED] px-5 py-2.5 text-white transition hover:bg-[#246fd1]"
            >
              Get started
            </Link>
          </nav>

          <Link
            href="/auth/login"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0B1F3A] md:hidden"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-[#2F80ED]">
              Dogla News Network
            </p>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-[#0B1F3A] sm:text-6xl lg:text-7xl">
              News, stories and conversations that matter.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500 sm:text-xl">
              Discover what people are talking about, share your perspective,
              and stay connected with the latest stories across Dogla.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="rounded-xl bg-[#2F80ED] px-7 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#246fd1]"
              >
                Join Dogla
              </Link>

              <Link
                href="/explore"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center text-sm font-bold text-[#0B1F3A] transition hover:bg-slate-50"
              >
                Explore stories
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative cards */}
        <div className="pointer-events-none absolute -bottom-24 right-[-80px] hidden w-[440px] rotate-6 lg:block">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B1F3A]" />
              <div>
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="mt-2 h-2 w-20 rounded bg-slate-100" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-11/12 rounded bg-slate-100" />
              <div className="h-3 w-8/12 rounded bg-slate-100" />
            </div>
            <div className="mt-5 h-36 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F80ED]">
            Built for conversation
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            More than just a news feed.
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Dogla brings stories and people together in one place, making it
            easy to discover what's happening and join the conversation.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            number="01"
            title="Discover stories"
            description="Explore the latest posts and stories shared across the Dogla community."
          />

          <FeatureCard
            number="02"
            title="Share your voice"
            description="Publish your thoughts, opinions and stories for other people to discover."
          />

          <FeatureCard
            number="03"
            title="Connect with people"
            description="Find interesting people, follow conversations and stay connected."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 mb-8 overflow-hidden rounded-3xl bg-[#0B1F3A] sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="px-6 py-14 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69A7FF]">
            Your story matters
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Be part of the conversation.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Join Dogla to discover stories, share your perspective and connect
            with people around you.
          </p>

          <Link
            href="/auth/signup"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0B1F3A] transition hover:bg-slate-100"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-bold text-[#0B1F3A]">Dogla News Network</p>
            <p className="mt-1 text-xs">
              News, stories and conversations that matter.
            </p>
          </div>

          <div className="flex gap-5">
            <Link href="/explore" className="hover:text-[#2F80ED]">
              Explore
            </Link>
            <Link href="/auth/login" className="hover:text-[#2F80ED]">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:text-[#2F80ED]">
              Sign up
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Dogla News Network. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-xs font-black tracking-[0.15em] text-[#2F80ED]">
        {number}
      </p>

      <h3 className="mt-5 text-xl font-black text-[#0B1F3A]">{title}</h3>

      <p className="mt-3 leading-7 text-slate-500">{description}</p>
    </div>
  );
}