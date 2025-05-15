import { AppShell } from "@/components/layout/app-shell"

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
