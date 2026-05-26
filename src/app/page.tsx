import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NexoLogo } from "@/components/ui/nexo-logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <NexoLogo showText />
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
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#6c3ce1_0%,transparent_50%)] opacity-15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#0099ff_0%,transparent_50%)] opacity-10" />
          <div className="container mx-auto px-4 text-center relative">
            <div className="mb-8 flex justify-center">
              <NexoLogo className="h-16 w-16 md:h-20 md:w-20" />
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Learn Smarter
              <br />
              <span className="text-gradient-warm">with AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload your books, lecture slides, and notes. Chat with AI, generate interactive lessons and quizzes, and compete on global leaderboards.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="btn-brand text-lg px-8">
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
              <div className="card-brand p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white text-xl">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-heading font-semibold">Upload Anything</h3>
                <p className="text-sm text-muted-foreground">
                  PDFs, slides, documents — AI extracts and understands your materials instantly.
                </p>
              </div>
              <div className="card-brand p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-cool text-white text-xl">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-heading font-semibold">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with your materials. Generate interactive lessons and quizzes on demand.
                </p>
              </div>
              <div className="card-brand p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-white text-xl">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-heading font-semibold">Gamified & Social</h3>
                <p className="text-sm text-muted-foreground">
                  Earn XP, climb leagues, unlock achievements, and share knowledge with the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { step: "1", title: "Upload", desc: "Drop your study materials" },
                { step: "2", title: "Learn", desc: "Chat with AI about content" },
                { step: "3", title: "Practice", desc: "Take AI-generated quizzes" },
                { step: "4", title: "Compete", desc: "Earn XP & climb leagues" },
              ].map((item) => (
                <div key={item.step} className="card-brand p-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex justify-center">
                <NexoLogo className="h-12 w-12" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4">Ready to learn smarter?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of learners using AI to accelerate their education.
              </p>
              <Link href="/auth">
                <Button size="lg" className="btn-brand text-lg px-10">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduAI. Built with Next.js & Supabase.
          </div>
        </footer>
      </main>
    </div>
  );
}
