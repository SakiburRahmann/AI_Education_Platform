import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Edu<span className="text-primary">AI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button>Get Started Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Learn Smarter
              <br />
              <span className="text-primary">with AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload your books, lecture slides, and notes. Chat with AI, generate interactive lessons and quizzes, and compete on global leaderboards.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border p-6">
                <div className="mb-4 text-3xl">📚</div>
                <h3 className="mb-2 text-lg font-semibold">Upload Anything</h3>
                <p className="text-sm text-muted-foreground">
                  PDFs, slides, documents — AI extracts and understands your materials instantly.
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <div className="mb-4 text-3xl">🤖</div>
                <h3 className="mb-2 text-lg font-semibold">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with your materials. Generate interactive lessons and quizzes on demand.
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <div className="mb-4 text-3xl">🏆</div>
                <h3 className="mb-2 text-lg font-semibold">Gamified & Social</h3>
                <p className="text-sm text-muted-foreground">
                  Earn XP, climb leagues, unlock achievements, and share knowledge with the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { step: "1", title: "Upload", desc: "Drop your study materials" },
                { step: "2", title: "Learn", desc: "Chat with AI about content" },
                { step: "3", title: "Practice", desc: "Take AI-generated quizzes" },
                { step: "4", title: "Compete", desc: "Earn XP & climb leagues" },
              ].map((item) => (
                <div key={item.step}>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduAI. Built with Next.js & Supabase.
          </div>
        </footer>
      </main>
    </div>
  );
}
