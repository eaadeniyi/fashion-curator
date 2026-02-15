"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500" />
          <span className="text-xl font-bold tracking-tight">Curator</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/quiz"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Get Styled
          </Link>
        </nav>
      </div>
    </header>
  );
}
