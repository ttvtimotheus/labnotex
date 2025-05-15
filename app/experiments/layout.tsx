import { AppShell } from "@/components/layout/app-shell"

export default function ExperimentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
