import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-primary text-xl font-bold">LabnoteX</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  LabnoteX: Elektronisches Laborbuch
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Ein modernes elektronisches Laborbuch für Forschung, Ausbildung, Biotech und klinische Anwendungen
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button>Loslegen</Button>
                </Link>
                <Link href="https://github.com/ttvtimotheus/labnotex" target="_blank" rel="noreferrer">
                  <Button variant="outline">GitHub</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-lg bg-primary p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Protokollierung</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Protokollieren Sie Experimente mit Markdown, Bildern und Dateien
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-lg bg-primary p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Biotech-Tools</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Integrierte Tools für Biologie und Biotechnologie
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-lg bg-primary p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Ausbildung</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ausbildungsnachweise, Bewertungen und Dokumentation
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-lg bg-primary p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <circle cx="18" cy="18" r="3" />
                    <circle cx="6" cy="6" r="3" />
                    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                    <path d="M11 18H8a2 2 0 0 1-2-2V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">KI-Integration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Zusammenfassungen, Fehleranalyse und Diskussion mit KI-Unterstützung
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 LabnoteX. Alle Rechte vorbehalten.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Datenschutz
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Nutzungsbedingungen
          </Link>
        </nav>
      </footer>
    </div>
  )
}
