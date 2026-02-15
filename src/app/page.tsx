import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Your AI{" "}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Fashion Curator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Get personalized outfit recommendations tailored to your style,
            body type, color preferences, and budget. From head to toe —
            including accessories, socks, and jewelry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quiz">
            <Button size="lg" className="text-base px-8">
              Start Styling
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-sm text-muted-foreground">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">10+</div>
            <div>Style Profiles</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">6</div>
            <div>Color Harmonies</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">14</div>
            <div>Item Categories</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">5</div>
            <div>Body Types</div>
          </div>
        </div>
      </div>
    </div>
  );
}
